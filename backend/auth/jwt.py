# backend/auth/jwt.py
"""
JWT helpers.

Three token kinds, distinguished by the `typ` claim:
  - access:       short-lived (e.g. 30 min), used in Authorization: Bearer ...
  - refresh:      long-lived (e.g. 7 days), used to get a new access token
  - mfa_pending:  very short-lived (e.g. 5 min), issued after password OK,
                  redeemed by /auth/mfa/verify with a TOTP code

We sign with HS256 using SECRET_KEY from settings.
"""

import secrets
from datetime import datetime, timedelta
from typing import Literal, Optional

from jose import JWTError, jwt

from app.config import settings


TokenKind = Literal["access", "refresh", "mfa_pending"]


def _now() -> datetime:
    return datetime.utcnow()


def _create_token(
    *,
    subject: str,
    typ: TokenKind,
    expires_delta: timedelta,
    extra_claims: Optional[dict] = None,
) -> str:
    """Internal: build and sign a JWT."""
    now = _now()
    payload = {
        "sub": subject,                    # user_id as string
        "typ": typ,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "jti": secrets.token_urlsafe(16),  # unique token id
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(user_id: int, role: str) -> str:
    return _create_token(
        subject=str(user_id),
        typ="access",
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        extra_claims={"role": role},
    )


def create_refresh_token(user_id: int) -> str:
    return _create_token(
        subject=str(user_id),
        typ="refresh",
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )


def create_mfa_pending_token(user_id: int) -> str:
    return _create_token(
        subject=str(user_id),
        typ="mfa_pending",
        expires_delta=timedelta(minutes=settings.MFA_PENDING_TOKEN_EXPIRE_MINUTES),
    )


def decode_token(token: str, *, expected_type: TokenKind) -> dict:
    """
    Decode and validate a token.
    Raises jose.JWTError on any failure (expired, bad signature, wrong type).
    """
    payload = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM],
    )
    if payload.get("typ") != expected_type:
        raise JWTError(f"Wrong token type: expected {expected_type}")
    return payload