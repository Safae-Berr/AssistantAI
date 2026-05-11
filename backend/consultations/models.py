from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)

    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)

    reason = Column(String, nullable=True)
    clinical_details = Column(Text, nullable=True)
    imaging_type = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    doctor = relationship("Doctor", back_populates="consultations")
    patient = relationship("Patient", back_populates="consultations")
    reports = relationship("Report", back_populates="consultation")