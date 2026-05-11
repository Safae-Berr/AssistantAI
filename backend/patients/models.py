# backend/patients/models.py
"""
Patient profile.
Authenticates via patient_code + birth_date (no password).
"""

from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True
    )

    # --- RGPD: pseudonymized identifier used in logs/exports
    # (e.g. SHA256 hash of internal data, or a UUID4 anchored to creation)
    pseudonymized_id = Column(String, unique=True, index=True, nullable=False)

    # --- Patient-facing login code (e.g. "PAT-A4F8B3")
    patient_code = Column(String, unique=True, index=True, nullable=False)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)  # required for login

    phone = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    user = relationship("User", back_populates="patient_profile")
    reports = relationship("Report", back_populates="patient")
    consultations = relationship("Consultation", back_populates="patient")