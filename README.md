# MedAI Radiology

## Overview

MedAI Radiology is an intelligent AI-powered platform designed to assist healthcare professionals in generating automatic medical imaging reports. The system leverages generative AI to create precise neuroradiological reports from dictated audio or manually entered clinical details, significantly reducing report generation time while improving accuracy and patient care quality.

The application serves two primary user types:
- **Doctors**: Create, review, and manage neuroradiological reports
- **Patients**: Access their medical reports securely

## Technology Stack

### Frontend
- **React 19.2.5** - Modern JavaScript library for building user interfaces
- **Vite 8.0.10** - Fast build tool and development server
- **React Router DOM 7.14.2** - Declarative routing for React
- **Redux Toolkit 2.11.2** - State management for complex applications
- **React Redux 9.2.0** - Official React bindings for Redux
- **Axios 1.16.0** - HTTP client for API requests
- **Tailwind CSS 4.2.4** - Utility-first CSS framework
- **Lucide React 1.14.0** - Beautiful icon library

### Backend
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **Python 3.x** - Core programming language
- **SQLAlchemy** - SQL toolkit and ORM for database operations
- **Pydantic** - Data validation and settings management
- **SQLite** - Lightweight embedded database for development (PostgreSQL for production)
- **Security**: python-jose (JWT), passlib/bcrypt (password hashing), pyotp (MFA)
- **Machine Learning/AI Libraries**:
  - PyTorch - Deep learning framework
  - NumPy - Numerical computing
  - Pandas - Data manipulation and analysis
  - Scikit-learn - Machine learning algorithms
  - Matplotlib - Data visualization

#### Containerization & Deployment
- **Docker** - Container orchestration
- **Docker Compose** - Multi-service orchestration
- **PostgreSQL 16** - Production database
- **Alpine Linux** - Lightweight container images
- **Uvicorn** - ASGI server with auto-reload

### Development Tools
- **ESLint** - JavaScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **FFmpeg** - Audio/video processing (backend)

## Project Structure

```
AssistantAI/
├── .git/                    # Git repository
├── .gitignore               # Git ignore rules
├── .vscode/                 # VS Code settings
├── README.md                # Main project documentation
├── docker-compose.yml       # Multi-service Docker orchestration
│
├── backend/                 # FastAPI backend application
│   ├── Dockerfile           # Backend container configuration
│   ├── .env                 # Environment variables (not in git)
│   ├── .gitignore          # Backend git ignore
│   ├── requirements.txt      # Python dependencies
│   ├── SecretKey.py         # Secret key generation utility
│   ├── seed_admin.py        # Admin user seeding script
│   ├── medai.db             # SQLite database (development)
│   │
│   ├── app/                 # Application configuration
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── config.py        # Application settings and environment config
│   │   └── database.py      # SQLAlchemy setup and database connection
│   │
│   ├── auth/                # Authentication and authorization module
│   │   ├── __init__.py
│   │   ├── models.py        # Auth-related database models
│   │   ├── routes.py        # Auth API endpoints
│   │   ├── schemas.py       # Pydantic schemas for auth requests/responses
│   │   ├── service.py       # Auth business logic and JWT management
│   │   ├── permissions.py   # Role-based access control (RBAC)
│   │   ├── jwt.py           # JWT token utilities
│   │   ├── cookies.py       # HTTP-only cookie management
│   │   └── __pycache__/
│   │
│   ├── users/               # User management module
│   │   ├── models.py        # User database models (User, UserRole)
│   │   ├── routes.py        # User API endpoints
│   │   ├── schemas.py       # Pydantic user schemas
│   │   ├── service.py       # User business logic
│   │   ├── repository.py    # User data access layer
│   │   └── __pycache__/
│   │
│   ├── doctors/             # Doctor management module
│   │   ├── models.py        # Doctor profile model
│   │   ├── routes.py        # Doctor API endpoints (/doctors)
│   │   ├── schemas.py       # Doctor Pydantic schemas
│   │   ├── service.py       # Doctor business logic
│   │   └── __pycache__/
│   │
│   ├── patients/            # Patient management module
│   │   ├── models.py        # Patient profile model
│   │   ├── routes.py        # Patient API endpoints (/patients)
│   │   ├── schemas.py       # Patient Pydantic schemas
│   │   ├── service.py       # Patient business logic
│   │   └── __pycache__/
│   │
│   ├── reports/             # Medical report management module
│   │   ├── models.py        # Report database model
│   │   ├── routes.py        # Report API endpoints (/reports)
│   │   ├── schemas.py       # Report Pydantic schemas
│   │   ├── service.py       # Report business logic
│   │   ├── pdf_service.py   # PDF generation for reports
│   │   └── __pycache__/
│   │
│   ├── consultations/       # Medical consultations module
│   │   ├── models.py        # Consultation database model
│   │   ├── routes.py        # Consultation API endpoints
│   │   ├── schemas.py       # Consultation Pydantic schemas
│   │   ├── service.py       # Consultation business logic
│   │   └── __pycache__/
│   │
│   ├── dashboard/           # Dashboard analytics module
│   │   ├── routes.py        # Dashboard API endpoints (/dashboard)
│   │   └── service.py       # Dashboard statistics and metrics
│   │
│   ├── analytics/           # AI performance analytics module
│   │   ├── models.py        # AIMetric database model
│   │   ├── routes.py        # Analytics API endpoints
│   │   ├── schemas.py       # Analytics Pydantic schemas
│   │   └── service.py       # Analytics business logic
│   │
│   ├── knowledge_base/      # Medical knowledge management module
│   │   ├── models.py        # KnowledgeBaseEntry model
│   │   ├── routes.py        # Knowledge base API endpoints
│   │   ├── schemas.py       # Knowledge base schemas
│   │   ├── vector_store.py  # Vector database operations
│   │   ├── embedding.py     # Text embedding generation
│   │   ├── ingestion_service.py # Knowledge ingestion pipeline
│   │   └── __pycache__/
│   │
│   ├── ai/                  # AI/ML services orchestration
│   │   ├── asr_service.py              # Automatic Speech Recognition
│   │   ├── decision_tree_service.py    # Clinical decision tree logic
│   │   ├── dialogue_service.py         # Conversational AI dialogue
│   │   ├── orchestrator.py             # AI service orchestration and coordination
│   │   ├── rag_service.py              # Retrieval-Augmented Generation
│   │   ├── report_generation_service.py # AI report generation
│   │   ├── slot_filling_service.py     # Clinical entity extraction
│   │   ├── transcriptionCleaner.py     # Audio transcription processing
│   │   ├── routes.py                   # AI API endpoints (/ai)
│   │   └── __pycache__/
│   │
│   ├── shared/              # Shared utilities and common code
│   │   ├── exceptions.py    # Custom exception classes
│   │   ├── file_storage.py  # File upload and storage utilities
│   │   ├── responses.py     # Standardized API response formatting
│   │   └── __pycache__/
│   │
│   ├── uploads/             # File uploads directory
│   │   ├── audio/           # Audio files for medical dictation
│   │   └── reports/         # Generated report files
│   │
│   └── __pycache__/
│
└── frontend/                # React frontend application
    ├── Dockerfile           # Frontend container configuration
    ├── .gitignore          # Frontend git ignore
    ├── package.json         # Node.js dependencies and scripts
    ├── package-lock.json    # Dependency lock file
    ├── eslint.config.js     # ESLint configuration
    ├── vite.config.js       # Vite build configuration
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── index.html           # HTML entry point
    ├── README.md            # Frontend documentation
    │
    ├── public/              # Static public assets
    │   └── site.webmanifest # PWA manifest
    │
    ├── src/                 # React source code
    │   ├── main.jsx         # React entry point
    │   ├── App.jsx          # Main React application component
    │   ├── index.css        # Global styles
    │   │
    │   ├── components/      # Reusable React components
    │   │   ├── auth/        # Authentication components
    │   │   │   └── ProtectedRoute.jsx # Route protection wrapper
    │   │   │
    │   │   ├── dashboard/   # Dashboard UI components
    │   │   │   ├── StatCard.jsx       # Statistics card display
    │   │   │   └── RecentReportsTable.jsx # Recent reports table
    │   │   │
    │   │   ├── layout/      # Layout components
    │   │   │   ├── DoctorNavbar.jsx   # Doctor portal navigation
    │   │   │   ├── DoctorFooter.jsx   # Doctor portal footer
    │   │   │   ├── PatientNavbar.jsx  # Patient portal navigation
    │   │   │   └── HeroSection.jsx    # Welcome banner/hero section
    │   │   │
    │   │   ├── reports/     # Report-related components
    │   │   │   ├── AudioRecorder.jsx  # Audio recording component (TODO)
    │   │   │   ├── ReportEditor.jsx   # Report editing interface (TODO)
    │   │   │   ├── ReportForm.jsx     # Report creation form (TODO)
    │   │   │   └── ReportTable.jsx    # Reports listing table (TODO)
    │   │   │
    │   │   └── ui/          # Base UI components library
    │   │       ├── Button.jsx         # Reusable button component
    │   │       ├── Card.jsx           # Reusable card component
    │   │       └── Input.jsx          # Reusable input component
    │   │
    │   ├── pages/           # Page components corresponding to routes
    │   │   ├── auth/        # Authentication pages
    │   │   │   ├── DoctorLogin.jsx    # Doctor login page
    │   │   │   ├── DoctorRegister.jsx # Doctor registration page
    │   │   │   ├── MFASetup.jsx       # MFA setup page
    │   │   │   └── PatientAccess.jsx  # Patient access page
    │   │   │
    │   │   ├── doctor/      # Doctor portal pages
    │   │   │   ├── Dashboard.jsx      # Main doctor dashboard
    │   │   │   ├── History.jsx        # Report history page (TODO)
    │   │   │   └── NewReport.jsx      # New report creation page (TODO)
    │   │   │
    │   │   └── patient/     # Patient portal pages
    │   │       ├── HomePage.jsx           # Patient home page
    │   │       ├── PatientReports.jsx     # Patient reports list (TODO)
    │   │       └── PatientReportDetail.jsx # Individual report view (TODO)
    │   │
    │   ├── routes/          # Routing configuration
    │   │   ├── AppRoutes.jsx        # Main application routing
    │   │   ├── DoctorRoutes.jsx     # Doctor portal routes
    │   │   └── PatientRoutes.jsx    # Patient portal routes
    │   │
    │   ├── store/           # Redux state management
    │   │   ├── store.js     # Redux store configuration
    │   │   └── authSlice.js # Redux slice for authentication state
    │   │
    │   ├── hooks/           # Custom React hooks
    │   │   └── useResponsive.jsx # Responsive design hook
    │   │
    │   ├── services/        # API service functions
    │   │   └── api.jsx      # Axios API client with interceptors
    │   │
    │   ├── assets/          # Static assets and media
    │   │   └── logo.png     # Application logo
    │   │
    │   └── node_modules/    # NPM dependencies (not in git)
    │
    └── dist/                # Built frontend (production)
```

## Key Components and Services

### Implemented Services (Backend)
- **Authentication Service**: Complete JWT-based auth with MFA support
  - Doctor registration and login
  - Patient login via code and birth date
  - MFA setup and verification with TOTP
  - Session management with refresh tokens
  - Cookie-based authentication
- **Dashboard Service**: Provides dashboard statistics and recent reports queries
- **Doctor Management**: CRUD operations for doctor profiles, admin validation
- **Database Models**: Complete SQLAlchemy ORM models for all entities
- **CORS Middleware**: Configured for local development (http://localhost:5173)

### AI Services (Backend) - *Skeleton/In Development*
- **ASR Service**: Converts spoken medical dictation to text (TODO)
- **Dialogue Service**: Handles conversational interactions with doctors (TODO)
- **Decision Tree Service**: Applies clinical decision logic (TODO)
- **RAG Service**: Retrieval-Augmented Generation for context-aware responses (TODO)
- **Report Generation Service**: Creates structured medical reports (TODO)
- **Slot Filling Service**: Extracts clinical entities from text (TODO)
- **Transcription Cleaner**: Cleans and normalizes transcribed audio (TODO)

### Implemented Frontend Components
- **Authentication System**: Complete Redux-based auth with MFA support
  - Doctor login with optional MFA

## Key Components and Services

### Implemented Services (Backend)
- **Authentication Service**: Complete JWT-based auth with MFA support
  - Doctor registration and login
  - Patient login via code and birth date
  - MFA setup and verification with TOTP
  - Session management with refresh tokens
  - Cookie-based authentication
- **Dashboard Service**: Provides dashboard statistics and recent reports queries
- **Doctor Management**: CRUD operations for doctor profiles, admin validation
- **Database Models**: Complete SQLAlchemy ORM models for all entities
- **CORS Middleware**: Configured for local development (http://localhost:5173)

### AI Services (Backend) - *Skeleton/In Development*
- **ASR Service**: Converts spoken medical dictation to text (TODO)
- **Dialogue Service**: Handles conversational interactions with doctors (TODO)
- **Decision Tree Service**: Applies clinical decision logic (TODO)
- **RAG Service**: Retrieval-Augmented Generation for context-aware responses (TODO)
- **Report Generation Service**: Creates structured medical reports (TODO)
- **Slot Filling Service**: Extracts clinical entities from text (TODO)
- **Transcription Cleaner**: Cleans and normalizes transcribed audio (TODO)

### Implemented Frontend Components
- **Authentication System**: Complete Redux-based auth with MFA support
  - Doctor login with optional MFA
  - Patient access via code and birth date
  - Doctor registration
  - Session management and logout
- **Dashboard Page**: Main doctor interface with hero section, statistics, and recent reports
- **Patient Access Page**: Secure patient login interface with code and birth date
- **Doctor Navbar**: Navigation menu for doctor users
- **Doctor Footer**: Footer with company info, links, and contact information
- **Hero Section**: Welcome banner on dashboard
- **Stat Card**: Displays key metrics and statistics
- **Recent Reports Table**: Shows recent report activity
- **Protected Routes**: Role-based routing for doctors and patients
- **Responsive Design**: Mobile-friendly layouts using Tailwind CSS

### Frontend Components - *In Development*
- **Audio Recording**: Voice input for report dictation (TODO)
- **Report Editor**: Manual report editing and validation (TODO)
- **Report Form**: Form for manual report creation (TODO)
- **Report Table**: Reports listing component (TODO)
- **History Page**: Report history management (TODO)
- **New Report Page**: Report creation workflow (TODO)

### Core Services - *In Development*
- **Authentication Service**: JWT-based auth for doctors and patients (TODO)
- **User Management**: Role-based access control (TODO)
- **Report Management**: CRUD operations for medical reports (TODO)
- **PDF Generation**: Export reports to PDF format (TODO)
- **File Storage**: Handle uploads and generated files (TODO)
- **Knowledge Base**: Medical knowledge management with embeddings (TODO)

## Data Flow and Interactions

### Authentication & Session Management Flow
1. **Initial Load**: Frontend checks session via `bootstrapAuth` action
2. **Cookie Check**: Server validates JWT from HTTP-only cookie
3. **User Data Fetch**: If valid, `/auth/me` returns user profile with role
4. **Redux Store**: Auth state updated with user info and role
5. **Route Protection**: ProtectedRoute components block unauthorized access
6. **Token Refresh**: Response interceptor auto-refreshes expired tokens

### Report Generation Workflow (In Development)
1. **Doctor Initiates**: Doctor navigates to "New Report"
2. **Voice Input**: AudioRecorder component captures medical dictation
3. **Audio Processing**: Backend ASR service converts speech to text
4. **Text Cleaning**: Transcription cleaner preprocesses content
5. **Context Retrieval**: RAG service queries knowledge base
6. **AI Generation**: Report generation service creates structured output
7. **Slot Filling**: Extracts clinical entities (findings, impressions, etc.)
8. **Storage**: Report persisted to database with metadata
9. **PDF Export**: PDF service generates printable document
10. **UI Display**: ReportEditor component shows final report for review

### Role-Based Access Control
- **Admin**: Full system access, user management, validation workflows
- **Doctor**: Report creation, patient data access, profile management
- **Patient**: Read-only access to personal reports via secure code/DOB login

## Getting Started

### Docker Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd AssistantAI

# Create environment file
cp .env.example .env  # Configure your environment variables

# Start all services
docker-compose up --build

# Access the application:
# Frontend (Doctor): http://localhost:5173
# Frontend (Patient): http://localhost:5174
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Manual Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend API available at: http://localhost:8000
API documentation: http://localhost:8000/docs

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173 (doctor portal)
# OR
npm run dev:patient  # Runs on http://localhost:5174 (patient portal)
```

### Database
- **Development**: SQLite database is automatically created at `backend/medai.db`
- **Production/Docker**: PostgreSQL database configured via docker-compose
- Database tables are auto-created on first API run

## API Architecture

The backend API is organized into logical modules with clear separation of concerns:

### Module Structure
- **auth/** - Authentication and authorization logic
- **users/** - Core user management
- **doctors/** - Doctor profiles and management
- **patients/** - Patient profiles and data
- **reports/** - Medical report lifecycle
- **consultations/** - Consultation management
- **dashboard/** - Analytics and metrics
- **analytics/** - AI performance tracking
- **knowledge_base/** - Medical knowledge management
- **ai/** - AI/ML service orchestration
- **shared/** - Common utilities and exceptions
- **app/** - Application configuration and setup

### Request/Response Flow
1. **Frontend** makes HTTP request via Axios with credentials
2. **CORS Middleware** validates request origin
3. **Authentication** validates JWT tokens from HTTP-only cookies
4. **Router** directs to appropriate module endpoint
5. **Service** executes business logic with database transactions
6. **Response** formatted by Pydantic schema validation
7. **Interceptors** handle token refresh on 401 errors

### Currently Implemented
- `GET /` - Health check endpoint
- `GET /dashboard/stats` - Get dashboard statistics (monthly reports, average generation time, precision score)
- `GET /dashboard/recent-reports` - Get recent reports for dashboard display

#### Authentication
- `POST /auth/register/doctor` - Doctor self-registration
- `POST /auth/login` - Doctor/admin login (step 1, may require MFA)
- `POST /auth/mfa/setup` - Generate TOTP secret and QR code for MFA setup
- `POST /auth/mfa/confirm` - Confirm MFA setup with TOTP code
- `POST /auth/mfa/verify` - Complete login with MFA verification (step 2)
- `POST /auth/login/patient` - Patient login with code and birth date
- `POST /auth/refresh` - Refresh access tokens
- `POST /auth/logout` - Logout and clear session
- `GET /auth/me` - Get current user information

#### Doctors
- `GET /doctors/me` - Get current doctor's profile
- `PATCH /doctors/me` - Update current doctor's profile
- `GET /doctors` - List doctors (admin) or active doctors (doctor)
- `GET /doctors/pending` - List pending doctor validations (admin only)
- `GET /doctors/{id}` - Get specific doctor details
- `PATCH /doctors/{id}` - Admin: validate or disable doctor account
- `DELETE /doctors/{id}` - Admin: delete doctor account

- **Reports**
  - `GET /reports` - List reports
  - `POST /reports` - Create new report
  - `GET /reports/{id}` - Get specific report
  - `PUT /reports/{id}` - Update report
  - `DELETE /reports/{id}` - Delete report
  - `POST /reports/{id}/pdf` - Generate PDF

- **AI Services**
  - `POST /ai/transcribe` - Audio transcription
  - `POST /ai/generate-report` - Generate report from data
  - `POST /ai/dialogue` - Conversational AI interaction

- **Users**
  - `GET /users` - List users
  - `GET /users/{id}` - Get user details
  - `PUT /users/{id}` - Update user

- **Doctors & Patients**
  - `GET /doctors` - List doctors
  - `GET /patients` - List patients

- **Consultations**
  - `GET /consultations` - List consultations
  - `POST /consultations` - Create consultation

## Authentication and Authorization

The system implements role-based access control:

- **Doctors**: Full access to report creation, editing, and patient data
- **Patients**: Read-only access to their own reports
- **Admin**: System administration and user management

Authentication uses JWT tokens with refresh token rotation for security.

## Database Schema/Models

The application uses **SQLite** as the database backend with SQLAlchemy ORM.

### User Models
- **User**: Base user model
  - `id` (Integer, PK)
  - `email` (String, unique)
  - `hashed_password` (String)
  - `full_name` (String)
  - `role` (String) - Values: "admin", "doctor", "patient"
  - `is_active` (Boolean)
  - `created_at` (DateTime)

- **Doctor**: Extended user profile for medical professionals
  - `id` (Integer, PK)
  - `user_id` (Integer, FK to users)
  - `specialty` (String)
  - `license_number` (String)
  - `hospital_name` (String)
  - `created_at` (DateTime)
  - Relationships: reports, consultations

- **Patient**: Extended user profile for patients
  - `id` (Integer, PK)
  - `user_id` (Integer, FK to users)
  - `first_name` (String)
  - `last_name` (String)
  - `date_of_birth` (DateTime)
  - `gender` (String)
  - `phone` (String)
  - `created_at` (DateTime)
  - Relationships: reports, consultations

### Medical Models
- **Report**: Medical imaging reports
  - `id` (Integer, PK)
  - `consultation_id` (Integer, FK to consultations)
  - `doctor_id` (Integer, FK to doctors)
  - `patient_id` (Integer, FK to patients)
  - `imaging_type` (String) - Type of medical imaging
  - `raw_input` (Text) - Raw transcription or input
  - `cleaned_input` (Text) - Processed input
  - `generated_report` (Text) - AI-generated content
  - `final_report` (Text) - Final reviewed report
  - `status` (String) - Report status
  - `pdf_path` (String) - Path to generated PDF
  - `created_at` (DateTime)
  - `validated_at` (DateTime)

- **Consultation**: Medical consultations
  - `id` (Integer, PK)
  - `doctor_id` (Integer, FK to doctors)
  - `patient_id` (Integer, FK to patients)
  - `reason` (String) - Reason for consultation
  - `clinical_details` (Text) - Clinical notes
  - `imaging_type` (String)
  - `created_at` (DateTime)
  - Relationships: reports

- **KnowledgeBaseEntry**: Medical knowledge base
  - `id` (Integer, PK)
  - `title` (String)
  - `content` (Text)
  - `source` (String)
  - `category` (String)
  - `embedding_id` (String) - Vector embedding identifier
  - `created_at` (DateTime)

### Analytics Model
- **AIMetric**: Performance metrics for AI-generated reports
  - `id` (Integer, PK)
  - `report_id` (Integer, FK to reports)
  - `doctor_id` (Integer, FK to doctors)
  - `generation_time_ms` (Integer) - Report generation time in milliseconds
  - `transcription_confidence` (Float) - ASR confidence score
  - `doctor_corrections_count` (Integer) - Number of corrections by doctor
  - `ai_precision_score` (Float) - Precision/accuracy metric
  - `created_at` (DateTime)

### Relationships
- User → Doctor (one-to-one, optional)
- User → Patient (one-to-one, optional)
- Doctor → Reports (one-to-many)
- Patient → Reports (one-to-many)
- Consultation → Reports (one-to-many)
- Report → AIMetric (one-to-many)

## Deployment Considerations

### Current Development Setup
- **Database**: SQLite for development, PostgreSQL for Docker/production
- **Frontend Development**: Vite dev server with separate ports for doctor/patient portals
- **Backend Development**: FastAPI/Uvicorn with auto-reload
- **Containerization**: Docker Compose with multi-service setup
- **Environment**: Local development with hot reloading

### Production Deployment Recommendations
- **Database Migration**: Migrate from SQLite to PostgreSQL for production
  - Update `DATABASE_URL` in [backend/app/database.py](backend/app/database.py)
  - Docker Compose uses PostgreSQL 16 by default
  - Use Alembic for schema migrations
- **Container Runtime**: Deploy with Docker Compose or Kubernetes
  - Multi-stage Docker builds for optimized images
  - Python 3.11 slim base with FFmpeg for audio processing
  - Node.js Alpine for lightweight frontend container
- **Reverse Proxy**: Nginx configuration
  - HTTPS/TLS termination
  - Static file serving for frontend assets
  - API routing to backend container
- **Frontend Build**: `npm run build` generates optimized static assets
  - Vite optimizations for production
  - CSS/JS minification and bundling
  - Source map generation for debugging
- **SSL/TLS**: Configure HTTPS certificates (Let's Encrypt recommended)
- **Environment Configuration**: Use Docker secrets and environment variables
  - Never commit `.env` files
  - Use `.env.example` for documentation

### Security Considerations
- **CORS Configuration**: Update allowed origins from localhost to production domain in [backend/app/main.py](backend/app/main.py)
- **API Security**: Implement rate limiting and input validation (TODO)
- **Data Encryption**: Encrypt sensitive medical data at rest and in transit
- **HIPAA Compliance**: Implement medical data privacy measures
- **Authentication**: Complete JWT implementation for API protection (TODO)

### Monitoring and Logging
- **Application Monitoring**: Health check endpoint at `GET /`
- **Error Tracking**: Implement centralized error logging
- **Performance Metrics**: Dashboard provides generation time and precision metrics

### Backup Strategy
- **Database Backups**: Regular SQLite database backups in development; automated backups in production
- **File Backups**: Backup uploaded audio files and generated reports

---

## Development Practices

### Code Organization

**Backend**
- Modules are organized by domain (auth, doctors, patients, reports, etc.)
- Each module contains: `models.py`, `routes.py`, `schemas.py`, `service.py`
- Shared utilities in `shared/` directory
- Configuration centralized in `app/config.py`

**Frontend**
- Components organized by feature (auth, dashboard, reports, layout, ui)
- Redux store in `store/` with slice-based architecture
- Services for API calls in `services/`
- Custom hooks in `hooks/`
- Pages correspond to major routes

### Best Practices

**Backend (Python/FastAPI)**
- Use dependency injection via FastAPI `Depends()`
- Validate all inputs with Pydantic schemas
- Use transactions for multi-step operations
- Consistent error handling with custom exceptions
- Type hints on all functions
- Docstrings for complex logic

**Frontend (React/Redux)**
- Functional components with hooks
- Redux Toolkit for state management
- Custom hooks for shared logic
- Protected routes for authentication
- Axios interceptors for token management
- Consistent error handling in UI

### Testing

```bash
# Backend testing
cd backend
pytest

# Frontend linting
cd frontend
npm run lint
```

### Database Migrations

When making schema changes:
```bash
# Generate migration
alembic revision --autogenerate -m "Description of change"

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### Performance Considerations

- **Caching**: Dashboard stats cached to reduce database queries
- **Pagination**: List endpoints support skip/limit parameters
- **Lazy Loading**: Reports and consultations loaded on demand
- **Database Indexes**: Indexes on frequently queried fields (email, doctor_id, patient_id)
- **Frontend Optimization**: Code splitting, tree shaking with Vite

**Current Phase**: Early Development

### Completed ✓
- Backend project structure and database models with SQLAlchemy ORM
- Complete authentication system with JWT, MFA, and role-based access
- Doctor and patient user management with admin validation workflow
- Frontend routing with protected routes for doctors and patients
- Doctor dashboard with statistics display and navigation
- Patient access interface with secure login
- Redux state management for authentication
- UI component library (Button, Card, Input) with Tailwind CSS
- Docker containerization with PostgreSQL for production
- Responsive design and mobile-friendly layouts
- API documentation with FastAPI auto-generated docs

### In Progress 🔄
- Frontend pages implementation (History, NewReport, PatientReports)
- Dashboard data binding and real-time updates
- Additional UI components (AudioRecorder, ReportEditor, etc.)
- Patient dashboard and report viewing interface
- Admin panel for user management

### To Do 📋
- All AI/ML services (ASR, RAG, Report Generation, etc.)
- Report CRUD operations and management
- Audio recording and processing pipeline
- PDF generation and export functionality
- Knowledge base ingestion and vector embeddings
- File upload and storage for audio/reports
- Advanced analytics and reporting features
- API route implementations for reports, consultations, analytics
- Error handling, validation, and logging improvements
- Testing (unit, integration, E2E)
- Production deployment optimizations
- HIPAA compliance and security audits

### Notes
- The project uses SQLite for local development and PostgreSQL for Docker/production
- Authentication system is fully implemented with MFA support for doctors
- Frontend supports separate portals for doctors and patients via environment variables
- Database migrations will be needed when moving to production
- Most AI/ML services are skeleton implementations awaiting AI integration
- The application is designed with HIPAA compliance in mind for medical data
- FFmpeg is required in production for audio processing
- All API communication uses HTTP-only cookies for security

## Troubleshooting

### Backend Issues

**Database Connection Error**
```
# Check DATABASE_URL in .env
# For Docker: use 'db' as hostname, not 'localhost'
DATABASE_URL=postgresql://medai_user:medai_password@db:5432/medai
```

**Port 8000 Already in Use**
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :8000    # Windows (note the PID, then taskkill)
```

**Import Errors in Backend**
```bash
# Ensure you're in the backend directory
cd backend
python -m pip install -r requirements.txt --upgrade
```

### Frontend Issues

**Port 5173 Already in Use**
```bash
npm run dev -- --port 5174  # Use different port
```

**CORS Errors**
```
# Check BACKEND_CORS_ORIGINS in backend/.env
# Must include your frontend URL
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

**Blank Dashboard**
```
# Check browser console for errors
# Verify API is running at http://localhost:8000
# Check Redux DevTools extension for state
```

### Docker Issues

**Container Build Failure**
```bash
# Clear Docker cache and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

**Database Connection in Containers**
```
# Use service names (db, backend, frontend) not localhost
# Containers communicate via internal Docker network
```