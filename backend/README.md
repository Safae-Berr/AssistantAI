# MedAI Radiology Backend

FastAPI-based backend for the MedAI Radiology platform, providing RESTful APIs for medical report generation and management.

## Features

- **Authentication**: JWT-based auth with MFA support
- **User Management**: Role-based access control (Admin, Doctor, Patient)
- **Medical Reports**: CRUD operations for radiology reports
- **AI Integration**: Skeleton for ML/AI services (ASR, RAG, Report Generation)
- **Database**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **Security**: CORS, input validation, secure cookies

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **Pydantic** - Data validation
- **JWT** - Token-based authentication
- **PyOTP** - MFA with TOTP
- **Uvicorn** - ASGI server

## Development Setup

### Prerequisites
- Python 3.8+
- pip

### Installation
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Database Setup
The application uses SQLite by default for development:

```bash
# Database is auto-created on first run
# For production, set DATABASE_URL environment variable
```

### Running the Server
```bash
uvicorn app.main:app --reload
```

API will be available at http://localhost:8000
Documentation at http://localhost:8000/docs

## Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL=sqlite:///./medai.db
SECRET_KEY=your-secret-key-here
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:5174
ENVIRONMENT=development
```

## Project Structure

```
backend/
├── app/                    # Main application
│   ├── main.py            # FastAPI app entry point
│   ├── config.py          # Configuration settings
│   ├── database.py        # Database connection
│   └── __init__.py
├── auth/                   # Authentication module
│   ├── routes.py          # Auth API endpoints
│   ├── service.py         # Auth business logic
│   ├── models.py          # Auth-related models
│   ├── schemas.py         # Pydantic schemas
│   ├── permissions.py     # Role-based permissions
│   └── cookies.py         # Cookie utilities
├── users/                  # User management
├── doctors/                # Doctor-specific features
├── patients/               # Patient management
├── reports/                # Report generation
├── consultations/          # Medical consultations
├── dashboard/              # Dashboard analytics
├── analytics/              # AI performance metrics
├── knowledge_base/         # Medical knowledge
├── ai/                     # AI/ML services
├── shared/                 # Shared utilities
└── uploads/                # File uploads
```

## API Endpoints

### Authentication
- `POST /auth/register/doctor` - Register new doctor
- `POST /auth/login` - Doctor login
- `POST /auth/mfa/setup` - Setup MFA
- `POST /auth/mfa/verify` - Verify MFA
- `POST /auth/login/patient` - Patient login
- `GET /auth/me` - Current user info

### Dashboard
- `GET /dashboard/stats` - Dashboard statistics
- `GET /dashboard/recent-reports` - Recent reports

### Doctors
- `GET /doctors/me` - Current doctor profile
- `PATCH /doctors/me` - Update profile
- `GET /doctors` - List doctors
- `GET /doctors/pending` - Pending validations (admin)

## Database Models

The application uses SQLAlchemy ORM with the following main models:

- **User**: Base user with role-based access
- **Doctor**: Extended doctor profile
- **Patient**: Extended patient profile
- **Report**: Medical imaging reports
- **Consultation**: Medical consultations
- **AIMetric**: AI performance metrics

## Authentication Flow

### Doctor Authentication
1. Register with email/password
2. Login with credentials
3. If MFA enabled, verify with TOTP code
4. Receive JWT access/refresh tokens via cookies

### Patient Authentication
1. Login with patient code + birth date
2. Receive JWT tokens for session

## Security Features

- **JWT Tokens**: Short-lived access tokens with refresh rotation
- **MFA**: TOTP-based two-factor authentication for doctors
- **Role-Based Access**: Admin, Doctor, Patient permissions
- **Secure Cookies**: HTTP-only cookies for token storage
- **CORS**: Configured origins for frontend access
- **Input Validation**: Pydantic schemas for all inputs

## Development Guidelines

### Code Style
- Follow PEP 8 Python style guide
- Use type hints for function parameters and return values
- Write descriptive docstrings for modules and functions

### Database
- Use SQLAlchemy ORM for all database operations
- Define models in separate files under their modules
- Use Pydantic schemas for API request/response validation

### API Design
- Use RESTful conventions
- Include proper HTTP status codes
- Provide detailed error messages
- Document endpoints with OpenAPI/Swagger

### Testing
```bash
pytest
```

### Migrations (Future)
When ready for production migrations:
```bash
alembic revision --autogenerate -m "Migration message"
alembic upgrade head
```