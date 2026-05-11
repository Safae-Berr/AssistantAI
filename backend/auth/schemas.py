# backend/auth/schemas.py
"""
Pydantic v2 schemas for the auth API.

With httpOnly cookies, tokens are NOT returned in the JSON body. The response
just signals success/MFA-required and identifies the user.
"""

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ============================================================================
# Doctor registration (auto-service)
# ============================================================================

class DoctorRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    speciality: Optional[str] = Field(default=None, max_length=120)
    rpps_number: str = Field(min_length=8, max_length=20)
    hospital: Optional[str] = Field(default=None, max_length=200)


class DoctorRegisterResponse(BaseModel):
    user_id: int
    doctor_id: int
    email: EmailStr
    message: str
    mfa_setup_required: bool = True
    pending_admin_validation: bool = True


# ============================================================================
# Login (doctor / admin)
# ============================================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """
    Two shapes — but tokens are NEVER in the body. They're in httpOnly cookies.
      - mfa_required=True  : mfa_pending cookie is set, frontend asks for TOTP
      - mfa_required=False : access + refresh cookies are set, user is logged in
    """
    mfa_required: bool
    user_id: int
    role: str


# ============================================================================
# Patient login
# ============================================================================

class PatientLoginRequest(BaseModel):
    patient_code: str = Field(min_length=4, max_length=40)
    birth_date: date


class AuthSuccessResponse(BaseModel):
    """Returned when access+refresh cookies have been set."""
    user_id: int
    role: str


# ============================================================================
# MFA
# ============================================================================

class MFASetupResponse(BaseModel):
    """Returned once after setup: secret + provisioning URI + QR code data."""
    secret: str
    otpauth_uri: str
    qr_code_svg: str


class MFAConfirmRequest(BaseModel):
    totp_code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class MFAVerifyRequest(BaseModel):
    """The mfa_pending cookie is read server-side; only the TOTP code is sent."""
    totp_code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


# ============================================================================
# Me
# ============================================================================

class MeResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    is_active: bool
    is_validated: bool
    mfa_enabled: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime

    first_name: Optional[str] = None
    last_name: Optional[str] = None
    speciality: Optional[str] = None
    hospital: Optional[str] = None
