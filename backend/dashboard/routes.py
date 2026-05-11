from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from .service import get_dashboard_stats, get_recent_reports

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)


@router.get("/recent-reports")
def recent_reports(db: Session = Depends(get_db)):
    return get_recent_reports(db)