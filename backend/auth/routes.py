# backend/auth/routes.py
"""
Authentication endpoints — cookie-based.

  POST /auth/register/doctor   — doctor self-registration
  POST /auth/login             — doctor/admin login (sets cookies)
  POST /auth/mfa/setup         — generate TOTP secret + QR (auth required)
  POST /auth/mfa/confirm       — confirm TOTP setup (auth required)
  POST /auth/mfa/verify        — login step 2 (reads mfa_pending cookie)
  POST /auth/login/patient     — patient login (code + birth date)
  POST /auth/refresh           — rotate cookies
  POST /auth/logout            — clear cookies
  GET  /auth/me                — current user info
"""

from fastapi import APIRouter, Cookie, Depends, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from auth import service
from auth.cookies import MFA_PENDING_COOKIE, REFRESH_COOKIE
from auth.permissions import get_current_user
from auth.schemas import (
    DoctorRegisterRequest,
    DoctorRegisterResponse,
    LoginRequest,       
    LoginResponse,
    MFAConfirmRequest,
    MFASetupResponse,
    MFAVerifyRequest,
    PatientLoginRequest,
    AuthSuccessResponse,
    MeResponse,
)
from users.models import User, UserRole


router = APIRouter(prefix="/auth", tags=["Authentication"])


# ============================================================================
# Registration
# ============================================================================

@router.post(
    "/register/doctor",
    response_model=DoctorRegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_doctor(payload: DoctorRegisterRequest, db: Session = Depends(get_db)):
    user, doctor = service.register_doctor(
        db,
        email=payload.email,
        password=payload.password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        speciality=payload.speciality,
        rpps_number=payload.rpps_number,
        hospital=payload.hospital,
    )
    return DoctorRegisterResponse(
        user_id=user.id,
        doctor_id=doctor.id,
        email=user.email,
        message=(
            "Account created. Log in (POST /auth/login) and set up MFA via "
            "/auth/mfa/setup. Once MFA is configured, wait for admin "
            "validation before you can log in again with full access."
        ),
    )


# ============================================================================
# Login (step 1)
# ============================================================================

@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    result = service.login(
        db, response, email=payload.email, password=payload.password
    )
    return LoginResponse(**result)


# ============================================================================
# MFA setup (requires auth)
# ============================================================================

@router.post("/mfa/setup", response_model=MFASetupResponse)
def mfa_setup(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return MFASetupResponse(**service.setup_mfa(db, user))


@router.post("/mfa/confirm", status_code=status.HTTP_204_NO_CONTENT)
def mfa_confirm(
    payload: MFAConfirmRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service.confirm_mfa_setup(db, user, payload.totp_code)
    return None


# ============================================================================
# MFA verify (step 2 of login)
# Reads mfa_pending from cookie set during step 1.
# ============================================================================

@router.post("/mfa/verify", response_model=AuthSuccessResponse)
def mfa_verify(
    payload: MFAVerifyRequest,
    response: Response,
    db: Session = Depends(get_db),
    mfa_pending: str | None = Cookie(default=None, alias=MFA_PENDING_COOKIE),
):
    if not mfa_pending:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="No MFA session in progress")
    result = service.verify_mfa(
        db,
        response,
        mfa_pending_token=mfa_pending,
        totp_code=payload.totp_code,
    )
    return AuthSuccessResponse(**result)


# ============================================================================
# Patient login
# ============================================================================

@router.post("/login/patient", response_model=AuthSuccessResponse)
def login_patient(
    payload: PatientLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    result = service.login_patient(
        db,
        response,
        patient_code=payload.patient_code,
        birth_date=payload.birth_date,
    )
    return AuthSuccessResponse(**result)


# ============================================================================
# Refresh — reads refresh_token cookie, rotates it
# ============================================================================

@router.post("/refresh", response_model=AuthSuccessResponse)
def refresh(
    response: Response,
    db: Session = Depends(get_db),
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_COOKIE),
):
    if not refresh_token:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="No refresh token cookie")
    result = service.refresh_access_token(db, response, refresh_token)
    return AuthSuccessResponse(**result)


# ============================================================================
# Logout — revoke refresh, clear cookies
# ============================================================================

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    db: Session = Depends(get_db),
    refresh_token: str | None = Cookie(default=None, alias=REFRESH_COOKIE),
):
    service.logout(db, response, refresh_token)
    return None


# ============================================================================
# /me
# ============================================================================

@router.get("/me", response_model=MeResponse)
def me(user: User = Depends(get_current_user)):
    response = MeResponse(
        id=user.id,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        is_validated=user.is_validated,
        mfa_enabled=user.mfa_enabled,
        last_login_at=user.last_login_at,
        created_at=user.created_at,
        first_name=user.first_name,
        last_name=user.last_name,
    )
    if user.role == UserRole.DOCTOR and user.doctor_profile:
        response.first_name = user.doctor_profile.first_name
        response.last_name = user.doctor_profile.last_name
        response.speciality = user.doctor_profile.speciality
        response.hospital = user.doctor_profile.hospital
    elif user.role == UserRole.PATIENT and user.patient_profile:
        response.first_name = user.patient_profile.first_name
        response.last_name = user.patient_profile.last_name
    return response
