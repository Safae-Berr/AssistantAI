from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from users.models import User, UserRole
from doctors.models import Doctor

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/doctors/pending")
def get_pending_doctors(
    db: Session = Depends(get_db)
):

    doctors = (
        db.query(Doctor)
        .join(User, Doctor.user_id == User.id)
        .filter(User.role == UserRole.DOCTOR)
        .filter(User.is_validated == False)
        .all()
    )

    return doctors


@router.post("/doctors/{user_id}/validate")
def validate_doctor(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_validated = True

    db.commit()

    return {
        "message": "Doctor validated successfully"
    }