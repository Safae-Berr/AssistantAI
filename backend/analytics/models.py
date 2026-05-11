# backend/analytics/models.py

from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class AIMetric(Base):
    __tablename__ = "ai_metrics"

    id = Column(Integer, primary_key=True, index=True)

    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    generation_time_ms = Column(Integer, nullable=True)
    transcription_confidence = Column(Float, nullable=True)
    doctor_corrections_count = Column(Integer, default=0)
    ai_precision_score = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="ai_metrics")