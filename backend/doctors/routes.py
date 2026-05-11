# backend/doctors/routes.py
"""
Doctor endpoints.

  GET    /doctors                 — list (admin) or list active (doctor)
  GET    /doctors/pending         — admin: pending validation
  GET    /doctors/me              — current doctor's profile
  PATCH  /doctors/me              — update own profile
  GET    /doctors/{id}            — get a doctor (admin)
  PATCH  /doctors/{id}            — admin: validate / disable
  DELETE /doctors/{id}            — admin: remove
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from auth.permissions import (
    get_current_user,
    require_admin,
    require_doctor,
    require_doctor_or_admin,
)
from doctors import service
from doctors.schemas import DoctorAdminPatch, DoctorRead, DoctorUpdate
from users.models import User, UserRole


router = APIRouter(prefix="/doctors", tags=["Doctors"])


# ---- /doctors/me must come BEFORE /doctors/{id} so FastAPI matches it first ----

@router.get("/me", response_model=DoctorRead)
def get_me(user: User = Depends(require_doctor), db: Session = Depends(get_db)):
    if not user.doctor_profile:
        # Should be impossible if data is consistent, but safety net
        from fastapi import HTTPException
        raise HTTPException(404, "Doctor profile not found")
    return service.get_doctor(db, user.doctor_profile.id)


@router.patch("/me", response_model=DoctorRead)
def update_me(
    payload: DoctorUpdate,
    user: User = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    return service.update_own_profile(db, user, payload)


# ---- Admin endpoints ----

@router.get("/pending", response_model=list[DoctorRead])
def list_pending(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    return service.list_doctors(db, pending_only=True)


@router.get("", response_model=list[DoctorRead])
def list_all(
    skip: int = 0,
    limit: int = 50,
    user: User = Depends(require_doctor_or_admin),
    db: Session = Depends(get_db),
):
    return service.list_doctors(db, skip=skip, limit=limit)


@router.get("/{doctor_id}", response_model=DoctorRead)
def get_one(
    doctor_id: int,
    _: User = Depends(require_doctor_or_admin),
    db: Session = Depends(get_db),
):
    return service.get_doctor(db, doctor_id)


@router.patch("/{doctor_id}", response_model=DoctorRead)
def admin_patch(
    doctor_id: int,
    payload: DoctorAdminPatch,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return service.admin_patch(db, doctor_id, payload)


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    doctor_id: int,
    _: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    service.delete_doctor(db, doctor_id)
    return None