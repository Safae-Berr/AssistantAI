# backend/auth/permissions.py
"""
FastAPI dependencies for protecting routes.

Hybrid authentication: reads the access_token cookie first (used by the
frontend), falls back to the Authorization Bearer header (useful for
Swagger UI testing and external API consumers).
"""

from typing import Optional

from fastapi import Cookie, Depends, Header, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from auth.cookies import ACCESS_COOKIE
from auth.jwt import decode_token
from users.models import User, UserRole


def _extract_token(
    cookie_token: Optional[str] = Cookie(default=None, alias=ACCESS_COOKIE),
    authorization: Optional[str] = Header(default=None),
) -> Optional[str]:
    """Cookie wins; Bearer header is fallback."""
    if cookie_token:
        return cookie_token
    if authorization and authorization.lower().startswith("bearer "):
        return authorization.split(" ", 1)[1].strip()
    return None


def get_current_user(
    token: Optional[str] = Depends(_extract_token),
    db: Session = Depends(get_db),
) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
    )
    if not token:
        raise credentials_exc
    try:
        payload = decode_token(token, expected_type="access")
    except JWTError:
        raise credentials_exc

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exc

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user or not user.is_active:
        raise credentials_exc
    return user


def require_role(*allowed_roles: str):
    def _checker(user: User = Depends(get_current_user)) -> User:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role in {allowed_roles}",
            )
        return user

    return _checker


require_admin = require_role(UserRole.ADMIN)
require_doctor = require_role(UserRole.DOCTOR)
require_patient = require_role(UserRole.PATIENT)
require_doctor_or_admin = require_role(UserRole.DOCTOR, UserRole.ADMIN)
