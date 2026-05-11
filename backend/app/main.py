# backend/app/main.py
"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine

# --- Import all models BEFORE create_all (so SQLAlchemy registers them) ---
# Order doesn't matter for create_all, but every model must be imported.
from users.models import User           # noqa: F401
from doctors.models import Doctor       # noqa: F401
from patients.models import Patient     # noqa: F401
from auth.models import AuthToken       # noqa: F401
from consultations.models import Consultation  # noqa: F401
from reports.models import Report       # noqa: F401
from analytics.models import AIMetric   # noqa: F401
from knowledge_base.models import KnowledgeBaseEntry  # noqa: F401

# --- Routers ---
from auth.routes import router as auth_router
from doctors.routes import router as doctors_router
from dashboard.routes import router as dashboard_router


# Auto-create tables (fine for dev; for prod use Alembic migrations)
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="MedAI Radiology API",
    version="0.1.0",
    description="Backend API for the MedAI Radiology platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,  # required for httpOnly cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(doctors_router)
app.include_router(dashboard_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "MedAI Radiology API is running",
        "environment": settings.ENVIRONMENT,
    }
