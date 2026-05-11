# backend/auth/service.py
"""
Business logic for authentication (cookie-based).

The login/register functions now accept a FastAPI Response object and set
httpOnly cookies directly. The returned dicts contain only non-sensitive
identity info (user_id, role).

Public functions:
    register_doctor(...)
    login(...)
    setup_mfa(...)
    confirm_mfa_setup(...)
    verify_mfa(...)
    login_patient(...)
    refresh_access_token(...)
    logout(...)
"""

import hashlib
import io
import secrets
import uuid
from datetime import date, datetime, timedelta
from typing import Optional

import pyotp
import segno
from fastapi import HTTPException, Response, status
from jose import JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.config import settings
from auth.cookies import (
    clear_auth_cookies,
    set_access_cookie,
    set_mfa_pending_cookie,
    set_refresh_cookie,
)
from auth.jwt import (
    create_access_token,
    create_mfa_pending_token,
    create_refresh_token,
    decode_token,
)
from auth.models import AuthToken, TokenType
from doctors.models import Doctor
from patients.models import Patient
from users.models import User, UserRole


# ----- Password hashing -----
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()


# ============================================================================
# 1. Doctor registration
# ============================================================================

def register_doctor(
    db: Session,
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    speciality: Optional[str],
    rpps_number: str,
    hospital: Optional[str],
) -> tuple[User, Doctor]:
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    if db.query(Doctor).filter(Doctor.rpps_number == rpps_number).first():
        raise HTTPException(status_code=409, detail="RPPS number already registered")

    user = User(
        email=email,
        hashed_password=hash_password(password),
        role=UserRole.DOCTOR,
        is_active=True,
        is_validated=False,
        mfa_enabled=False,
    )
    db.add(user)
    db.flush()

    doctor = Doctor(
        user_id=user.id,
        first_name=first_name,
        last_name=last_name,
        speciality=speciality,
        rpps_number=rpps_number,
        hospital=hospital,
    )
    db.add(doctor)
    db.commit()
    db.refresh(user)
    db.refresh(doctor)
    return user, doctor


# ============================================================================
# 2. Login (doctor / admin)
# ============================================================================

def login(
    db: Session,
    response: Response,
    *,
    email: str,
    password: str,
) -> dict:
    """
    Sets cookies and returns identity info (no tokens in the body).
    """
    user = db.query(User).filter(User.email == email).first()
    if (
        not user
        or not user.hashed_password
        or not verify_password(password, user.hashed_password)
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    if user.role == UserRole.DOCTOR and not user.is_validated:
        raise HTTPException(
            status_code=403, detail="Account pending admin validation"
        )

    if user.mfa_enabled:
        # Step 1 of MFA login: issue an mfa_pending cookie. No access yet.
        mfa_token = create_mfa_pending_token(user.id)
        _store_token(
            db, user.id, mfa_token, TokenType.MFA_PENDING,
            timedelta(minutes=settings.MFA_PENDING_TOKEN_EXPIRE_MINUTES),
        )
        set_mfa_pending_cookie(response, mfa_token)
        return {"mfa_required": True, "user_id": user.id, "role": user.role}

    # No MFA enabled — issue real cookies now.
    _issue_session_cookies(db, response, user)
    return {"mfa_required": False, "user_id": user.id, "role": user.role}


# ============================================================================
# 3. MFA setup (called by an already-authenticated user)
# ============================================================================

def setup_mfa(db: Session, user: User) -> dict:
    secret = pyotp.random_base32()
    user.mfa_secret = secret
    user.mfa_enabled = False
    db.commit()

    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(
        name=user.email, issuer_name=settings.MFA_ISSUER_NAME
    )

    qr = segno.make(uri, error="m")
    buf = io.BytesIO()
    qr.save(buf, kind="svg", scale=5, border=2)
    svg = buf.getvalue().decode("utf-8")

    return {"secret": secret, "otpauth_uri": uri, "qr_code_svg": svg}


def confirm_mfa_setup(db: Session, user: User, totp_code: str) -> None:
    if not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA setup not initiated")
    totp = pyotp.TOTP(user.mfa_secret)
    if not totp.verify(totp_code, valid_window=1):
        raise HTTPException(status_code=400, detail="Invalid TOTP code")
    user.mfa_enabled = True
    db.commit()


# ============================================================================
# 4. MFA verify (step 2 of login)
# ============================================================================

def verify_mfa(
    db: Session,
    response: Response,
    *,
    mfa_pending_token: str,
    totp_code: str,
) -> dict:
    try:
        payload = decode_token(mfa_pending_token, expected_type="mfa_pending")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired MFA token")

    token_hash = _hash_token(mfa_pending_token)
    stored = (
        db.query(AuthToken)
        .filter(AuthToken.token_hash == token_hash)
        .filter(AuthToken.token_type == TokenType.MFA_PENDING)
        .first()
    )
    if not stored or stored.revoked or stored.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired MFA token")

    if stored.attempts >= 5:
        stored.revoked = True
        db.commit()
        raise HTTPException(status_code=429, detail="Too many MFA attempts")

    user_id = int(payload["sub"])
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.mfa_enabled or not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA not enabled for this user")

    totp = pyotp.TOTP(user.mfa_secret)
    if not totp.verify(totp_code, valid_window=1):
        stored.attempts += 1
        db.commit()
        raise HTTPException(status_code=401, detail="Invalid TOTP code")

    stored.revoked = True
    db.commit()

    _issue_session_cookies(db, response, user)
    # The mfa_pending cookie is overwritten with empty value by frontend
    # logic, but we also explicitly delete it server-side.
    response.delete_cookie("mfa_pending", path="/auth")
    return {"user_id": user.id, "role": user.role}


# ============================================================================
# 5. Patient login (code + birth date)
# ============================================================================

def login_patient(
    db: Session,
    response: Response,
    *,
    patient_code: str,
    birth_date: date,
) -> dict:
    patient = db.query(Patient).filter(Patient.patient_code == patient_code).first()
    if not patient or patient.birth_date != birth_date:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = patient.user
    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    _issue_session_cookies(db, response, user)
    return {"user_id": user.id, "role": user.role}


# ============================================================================
# 6. Refresh
# ============================================================================

def refresh_access_token(
    db: Session,
    response: Response,
    refresh_token: str,
) -> dict:
    try:
        payload = decode_token(refresh_token, expected_type="refresh")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    token_hash = _hash_token(refresh_token)
    stored = (
        db.query(AuthToken)
        .filter(AuthToken.token_hash == token_hash)
        .filter(AuthToken.token_type == TokenType.REFRESH)
        .first()
    )
    if not stored or stored.revoked or stored.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or disabled")

    # Refresh rotation: revoke the old one
    stored.revoked = True
    db.commit()
    _issue_session_cookies(db, response, user)
    return {"user_id": user.id, "role": user.role}


# ============================================================================
# 7. Logout
# ============================================================================

def logout(
    db: Session,
    response: Response,
    refresh_token: Optional[str],
) -> None:
    """Revoke refresh token and clear all auth cookies."""
    if refresh_token:
        token_hash = _hash_token(refresh_token)
        stored = (
            db.query(AuthToken)
            .filter(AuthToken.token_hash == token_hash)
            .first()
        )
        if stored and not stored.revoked:
            stored.revoked = True
            db.commit()
    clear_auth_cookies(response)


# ============================================================================
# Helpers
# ============================================================================

def _issue_session_cookies(db: Session, response: Response, user: User) -> None:
    access = create_access_token(user.id, user.role)
    refresh = create_refresh_token(user.id)
    _store_token(
        db, user.id, refresh, TokenType.REFRESH,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    set_access_cookie(response, access)
    set_refresh_cookie(response, refresh)
    user.last_login_at = datetime.utcnow()
    db.commit()


def _store_token(
    db: Session,
    user_id: int,
    raw_token: str,
    token_type: str,
    lifetime: timedelta,
) -> None:
    token = AuthToken(
        user_id=user_id,
        token_hash=_hash_token(raw_token),
        token_type=token_type,
        expires_at=datetime.utcnow() + lifetime,
        revoked=False,
        attempts=0,
    )
    db.add(token)
    db.commit()


# ============================================================================
# Patient utilities
# ============================================================================

def generate_patient_code() -> str:
    suffix = secrets.token_hex(3).upper()
    return f"PAT-{suffix}"


def generate_pseudonymized_id() -> str:
    return uuid.uuid4().hex
