# backend/dashboard/service.py

from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime
from reports.models import Report
from analytics.models import AIMetric


def get_dashboard_stats(db: Session):
    now = datetime.utcnow()
    current_month = now.month
    current_year = now.year

    reports_count = (
        db.query(func.count(Report.id))
        .filter(extract("month", Report.created_at) == current_month)
        .filter(extract("year", Report.created_at) == current_year)
        .scalar()
    )

    avg_generation_time = (
        db.query(func.avg(AIMetric.generation_time_ms))
        .join(Report, Report.id == AIMetric.report_id)
        .filter(extract("month", Report.created_at) == current_month)
        .filter(extract("year", Report.created_at) == current_year)
        .scalar()
    )

    avg_precision = (
        db.query(func.avg(AIMetric.ai_precision_score))
        .join(Report, Report.id == AIMetric.report_id)
        .filter(extract("month", Report.created_at) == current_month)
        .filter(extract("year", Report.created_at) == current_year)
        .scalar()
    )

    return [
        {
            "label": "Rapports générés",
            "value": f"{reports_count or 0}",
            "trend": "+0% ce mois",
            "positive": True,
            "type": "reports"
        },
        {
            "label": "Temps moyen",
            "value": f"{round((avg_generation_time or 0) / 1000)}s",
            "trend": "+0% ce mois",
            "positive": False,
            "type": "time"
        },
        {
            "label": "Précision IA",
            "value": f"{round((avg_precision or 0) * 100, 1)}%",
            "trend": "+0% ce mois",
            "positive": True,
            "type": "accuracy"
        }
    ]