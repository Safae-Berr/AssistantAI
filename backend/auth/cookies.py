# backend/auth/cookies.py
"""
Cookie helpers for auth.

We store tokens in httpOnly cookies (not accessible to JavaScript) which
mitigates token theft via XSS. SameSite=Lax protects against CSRF on
state-changing requests (POST/PUT/PATCH/DELETE) without needing a
double-submit CSRF token.

Cookie names:
  - access_token   : the short-lived JWT (30 min)
  - refresh_token  : the long-lived JWT (7 days), path-scoped to /auth
  - mfa_pending    : the very short-lived token issued between login step 1
                     and step 2 when MFA is enabled (5 min)
"""

from fastapi import Response

from app.config import settings


ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"
MFA_PENDING_COOKIE = "mfa_pending"

# In dev (HTTP) we MUST set secure=False so the browser keeps the cookie.
# In prod (HTTPS) we set secure=True.
_IS_DEV = settings.ENVIRONMENT in ("development", "test")
_SECURE = not _IS_DEV
_SAMESITE = "lax"


def set_access_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE,
        value=token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=_SECURE,
        samesite=_SAMESITE,
        path="/",
    )


def set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE,
        value=token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        httponly=True,
        secure=_SECURE,
        samesite=_SAMESITE,
        # Path-scoped: the refresh cookie is only sent to /auth endpoints,
        # limiting its exposure surface.
        path="/auth",
    )


def set_mfa_pending_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=MFA_PENDING_COOKIE,
        value=token,
        max_age=settings.MFA_PENDING_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=_SECURE,
        samesite=_SAMESITE,
        path="/auth",
    )


def clear_auth_cookies(response: Response) -> None:
    """Clear access + refresh on logout."""
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/auth")
    response.delete_cookie(MFA_PENDING_COOKIE, path="/auth")
