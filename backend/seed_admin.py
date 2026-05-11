# backend/seed_admin.py
"""
Create the initial admin account.

Run from the backend/ folder:
    python -m scripts.seed_admin

You'll be prompted for email and password.
Admin accounts have:
  - is_validated=True (no admin-validation loop for the first admin)
  - mfa_enabled=False (you can enable MFA after first login)
"""

import getpass
import sys

from app.database import SessionLocal, Base, engine
from backend.auth.service import hash_password
from users.models import User, UserRole


def main() -> int:
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)

    print("=== MedAI: Seed initial admin ===")
    email = input("Admin email: ").strip().lower()
    if not email or "@" not in email:
        print("Invalid email.")
        return 1

    pw1 = getpass.getpass("Password (min 8 chars): ")
    pw2 = getpass.getpass("Confirm password: ")
    if pw1 != pw2:
        print("Passwords do not match.")
        return 1
    if len(pw1) < 8:
        print("Password too short.")
        return 1

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User {email} already exists (role={existing.role}).")
            return 1
        admin = User(
            email=email,
            hashed_password=hash_password(pw1),
            role=UserRole.ADMIN,
            is_active=True,
            is_validated=True,    # admin self-validated
            mfa_enabled=False,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print(f"OK — admin created (id={admin.id}, email={admin.email})")
        print("Login at POST /auth/login. You can enable MFA via /auth/mfa/setup.")
        return 0
    finally:
        db.close()


if __name__ == "__main__":
    sys.exit(main())