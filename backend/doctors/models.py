# backend/doctors/models.py
"""
Doctor profile — extends User for medical professionals.
"""

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer, ForeignKey("users.id"), unique=True, nullable=False, index=True
    )

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    # Speciality (UK spelling, aligned with the PFE doc)
    speciality = Column(String, nullable=True)

    # RPPS = Répertoire Partagé des Professionnels de Santé (FR standard)
    rpps_number = Column(String, unique=True, index=True, nullable=False)

    hospital = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    user = relationship("User", back_populates="doctor_profile")
    reports = relationship("Report", back_populates="doctor")
    consultations = relationship("Consultation", back_populates="doctor")