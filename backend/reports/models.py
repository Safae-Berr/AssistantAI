from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    consultation_id = Column(Integer, ForeignKey("consultations.id"), nullable=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)

    imaging_type = Column(String, nullable=True)

    raw_input = Column(Text, nullable=True)
    cleaned_input = Column(Text, nullable=True)

    generated_report = Column(Text, nullable=True)
    final_report = Column(Text, nullable=True)

    status = Column(String, default="generated")
    pdf_path = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    validated_at = Column(DateTime, nullable=True)

    consultation = relationship("Consultation", back_populates="reports")
    doctor = relationship("Doctor", back_populates="reports")
    patient = relationship("Patient", back_populates="reports")
    ai_metrics = relationship("AIMetric", back_populates="report")