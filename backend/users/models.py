# backend/users/models.py
"""
User model.
One User can be a Doctor OR a Patient (or Admin) — role distinguishes them.
"""

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class UserRole:
    ADMIN = "admin"
    DOCTOR = "doctor"
    PATIENT = "patient"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True, nullable=False)
    # nullable=True because patients authenticate with code + birth_date,
    # not with a password. For doctors/admins, this must be set.
    hashed_password = Column(String, nullable=True)

    role = Column(String, nullable=False)  # admin | doctor | patient

    # Optionnels : utilisés tels quels pour les admins,
    # surchargés par doctor_profile/patient_profile pour les autres.
    first_name = Column(String(80), nullable=True)
    last_name = Column(String(80), nullable=True)

    is_active = Column(Boolean, default=True, nullable=False)
    # is_validated: for doctors, set to True only by an admin
    # (auto-registration flow). True by default for admin/patient.
    is_validated = Column(Boolean, default=False, nullable=False)

    # --- MFA (TOTP) ---
    mfa_enabled = Column(Boolean, default=False, nullable=False)
    # Base32 secret used by the authenticator app. Never expose this via API
    # after the initial setup QR code.
    mfa_secret = Column(String, nullable=True)

    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    doctor_profile = relationship(
        "Doctor", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    patient_profile = relationship(
        "Patient", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    auth_tokens = relationship(
        "AuthToken", back_populates="user", cascade="all, delete-orphan"
    )