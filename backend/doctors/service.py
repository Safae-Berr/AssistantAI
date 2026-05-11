# backend/doctors/service.py
"""Business logic for the doctors module."""

from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from doctors.models import Doctor
from doctors.schemas import DoctorAdminPatch, DoctorUpdate
from users.models import User, UserRole


def _to_read_dict(doctor: Doctor) -> dict:
    """Flatten doctor + user into a single dict for DoctorRead."""
    u = doctor.user
    return {
        "id": doctor.id,
        "user_id": doctor.user_id,
        "email": u.email,
        "first_name": doctor.first_name,
        "last_name": doctor.last_name,
        "speciality": doctor.speciality,
        "rpps_number": doctor.rpps_number,
        "hospital": doctor.hospital,
        "is_active": u.is_active,
        "is_validated": u.is_validated,
        "mfa_enabled": u.mfa_enabled,
        "last_login_at": u.last_login_at,
        "created_at": doctor.created_at,
    }


def list_doctors(
    db: Session,
    *,
    pending_only: bool = False,
    skip: int = 0,
    limit: int = 50,
) -> list[dict]:
    q = db.query(Doctor).options(joinedload(Doctor.user))
    if pending_only:
        q = q.join(User).filter(User.is_validated.is_(False))
    doctors = q.order_by(Doctor.created_at.desc()).offset(skip).limit(limit).all()
    return [_to_read_dict(d) for d in doctors]


def get_doctor(db: Session, doctor_id: int) -> dict:
    doctor = (
        db.query(Doctor)
        .options(joinedload(Doctor.user))
        .filter(Doctor.id == doctor_id)
        .first()
    )
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return _to_read_dict(doctor)


def get_doctor_by_user_id(db: Session, user_id: int) -> Optional[Doctor]:
    return db.query(Doctor).filter(Doctor.user_id == user_id).first()


def update_own_profile(
    db: Session, user: User, payload: DoctorUpdate
) -> dict:
    if user.role != UserRole.DOCTOR or not user.doctor_profile:
        raise HTTPException(status_code=403, detail="Not a doctor account")
    doctor = user.doctor_profile

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(doctor, field, value)
    db.commit()
    db.refresh(doctor)
    return _to_read_dict(doctor)


def admin_patch(
    db: Session, doctor_id: int, payload: DoctorAdminPatch
) -> dict:
    doctor = (
        db.query(Doctor)
        .options(joinedload(Doctor.user))
        .filter(Doctor.id == doctor_id)
        .first()
    )
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    data = payload.model_dump(exclude_unset=True)
    if "is_active" in data:
        doctor.user.is_active = data["is_active"]
    if "is_validated" in data:
        doctor.user.is_validated = data["is_validated"]
    db.commit()
    db.refresh(doctor.user)
    return _to_read_dict(doctor)


def delete_doctor(db: Session, doctor_id: int) -> None:
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    # Cascade deletes the user too (cascade="all, delete-orphan" on User side
    # is on doctor_profile, so deleting User cascades to Doctor. Here we go
    # the other way — delete the User, doctor is auto-removed.)
    user = doctor.user
    db.delete(user)
    db.commit()