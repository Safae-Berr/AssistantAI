from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from users.models import User
from doctors.models import Doctor
from patients.models import Patient
from consultations.models import Consultation
from reports.models import Report
from analytics.models import AIMetric
from knowledge_base.models import KnowledgeBaseEntry

from dashboard.routes import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MedAI Radiology API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "MedAI Radiology API is running"}