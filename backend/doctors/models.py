from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    specialty = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    hospital_name = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="doctor_profile")

    reports = relationship("Report", back_populates="doctor")

    consultations = relationship(
        "Consultation",
        back_populates="doctor"
    )