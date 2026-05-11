from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

from reports.models import Report
from analytics.models import AIMetric
from patients.models import Patient


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
            "type": "reports",
        },
        {
            "label": "Temps moyen",
            "value": f"{round((avg_generation_time or 0) / 1000)}s",
            "trend": "+0% ce mois",
            "positive": False,
            "type": "time",
        },
        {
            "label": "Précision IA",
            "value": f"{round((avg_precision or 0) * 100, 1)}%",
            "trend": "+0% ce mois",
            "positive": True,
            "type": "accuracy",
        },
    ]


def get_recent_reports(db: Session):
    reports = (
        db.query(Report, Patient, AIMetric)
        .outerjoin(Patient, Patient.id == Report.patient_id)
        .outerjoin(AIMetric, AIMetric.report_id == Report.id)
        .order_by(Report.created_at.desc())
        .limit(4)
        .all()
    )

    result = []

    for report, patient, metric in reports:
        confidence = 0

        if metric and metric.ai_precision_score is not None:
            confidence = round(metric.ai_precision_score * 100)

        if report.status == "validated":
            status = "Validé"
        elif report.status == "pending":
            status = "En attente"
        elif report.status == "review":
            status = "À réviser"
        else:
            status = "Généré"

        result.append(
            {
                "id": f"CR-{report.created_at.year}-{str(report.id).zfill(4)}",
                "patient": (
                    f"{patient.first_name} {patient.last_name}"
                    if patient
                    else "Patient inconnu"
                ),
                "type": report.imaging_type or "Examen non précisé",
                "urgent": False,
                "date": report.created_at.strftime("%d/%m/%Y"),
                "time": report.created_at.strftime("%H:%M"),
                "confidence": confidence,
                "status": status,
            }
        )

    return result