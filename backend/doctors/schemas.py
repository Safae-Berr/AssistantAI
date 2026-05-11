# backend/doctors/schemas.py
"""Pydantic schemas for the doctors module."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class DoctorBase(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    speciality: Optional[str] = Field(default=None, max_length=120)
    rpps_number: str = Field(min_length=8, max_length=20)
    hospital: Optional[str] = Field(default=None, max_length=200)


class DoctorRead(DoctorBase):
    """Doctor profile returned by the API (joined with User info)."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    email: EmailStr
    is_active: bool
    is_validated: bool
    mfa_enabled: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime


class DoctorUpdate(BaseModel):
    """Fields a doctor can update on their own profile."""
    first_name: Optional[str] = Field(default=None, min_length=1, max_length=80)
    last_name: Optional[str] = Field(default=None, min_length=1, max_length=80)
    speciality: Optional[str] = Field(default=None, max_length=120)
    hospital: Optional[str] = Field(default=None, max_length=200)
    # NOTE: rpps_number is intentionally NOT editable here (legal identifier).


class DoctorAdminPatch(BaseModel):
    """Fields an admin can change on a doctor."""
    is_active: Optional[bool] = None
    is_validated: Optional[bool] = None