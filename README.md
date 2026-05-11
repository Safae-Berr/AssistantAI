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
- **Tailwind CSS 4.2.4** - Utility-first CSS framework
- **Lucide React 1.14.0** - Beautiful icon library

### Backend
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **Python 3.x** - Core programming language
- **Machine Learning/AI Libraries**:
  - PyTorch - Deep learning framework
  - NumPy - Numerical computing
  - Pandas - Data manipulation and analysis
  - Scikit-learn - Machine learning algorithms
  - Matplotlib - Data visualization

### Development Tools
- **ESLint** - JavaScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
AssistantAI/
├── README.md
├── backend/
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py          # FastAPI application entry point
│   │   ├── config.py        # Application configuration
│   │   └── database.py      # Database connection and setup
│   ├── ai/                  # AI/ML services
│   │   ├── asr_service.py              # Automatic Speech Recognition
│   │   ├── decision_tree_service.py    # Decision tree logic
│   │   ├── dialogue_service.py         # Conversational AI
│   │   ├── orchestrator.py             # AI service orchestration
│   │   ├── rag_service.py              # Retrieval-Augmented Generation
│   │   ├── report_generation_service.py # Report generation
│   │   ├── routes.py                   # AI-related API routes
│   │   ├── slot_filling_service.py     # Clinical data extraction
│   │   └── transcriptionCleaner.py     # Audio transcription cleaning
│   ├── analytics/          # Analytics and reporting
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── service.py
│   ├── app/               # Application core (duplicate - should be removed)
│   ├── auth/              # Authentication and authorization
│   │   ├── jwt.py         # JWT token handling
│   │   ├── permissions.py # Role-based permissions
│   │   ├── routes.py      # Auth API endpoints
│   │   ├── schemas.py     # Pydantic schemas for auth
│   │   └── service.py     # Auth business logic
│   ├── consultations/     # Medical consultations
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── dashboard/         # Dashboard functionality
│   │   ├── routes.py
│   │   └── service.py
│   ├── doctors/           # Doctor-specific features
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── knowledge_base/    # Medical knowledge management
│   │   ├── embedding.py   # Text embeddings
│   │   ├── ingestion_service.py # Knowledge ingestion
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── vector_store.py # Vector database operations
│   ├── patients/          # Patient management
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── reports/           # Report generation and management
│   │   ├── models.py
│   │   ├── pdf_service.py # PDF generation
│   │   ├── routes.py
│   │   ├── schemas.py
│   │   └── service.py
│   ├── shared/            # Shared utilities
│   │   ├── exceptions.py  # Custom exceptions
│   │   ├── file_storage.py # File upload/storage
│   │   └── responses.py   # Standardized API responses
│   ├── uploads/           # File uploads directory
│   │   ├── audio/         # Audio files for dictation
│   │   └── reports/       # Generated report files
│   └── users/             # User management
│       ├── models.py
│       ├── repository.py
│       ├── schemas.py
│       └── service.py
└── frontend/
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    │   └── site.webmanifest
    └── src/
        ├── App.jsx           # Main React application
        ├── index.css         # Global styles
        ├── main.jsx          # React entry point
        ├── assets/           # Static assets
        ├── components/
        │   ├── dashboard/
        │   │   ├── RecentReportsTable.jsx # Recent reports display
        │   │   └── StatCard.jsx           # Statistics cards
        │   ├── layout/
        │   │   ├── DoctorFooter.jsx       # Doctor interface footer
        │   │   ├── DoctorNavbar.jsx       # Doctor navigation
        │   │   ├── HeroSection.jsx        # Welcome banner
        │   │   └── PatientNavbar.jsx      # Patient navigation
        │   ├── reports/
        │   │   ├── AudioRecorder.jsx      # Audio recording component
        │   │   ├── ReportEditor.jsx       # Report editing interface
        │   │   ├── ReportForm.jsx         # Report creation form
        │   │   └── ReportTable.jsx        # Reports listing
        │   └── ui/
        │       ├── Button.jsx             # Reusable button component
        │       ├── Card.jsx               # Reusable card component
        │       └── Input.jsx              # Reusable input component
        ├── hooks/
        │   └── useResponsive.jsx          # Responsive design hook
        ├── pages/
        │   ├── auth/
        │   │   ├── DoctorLogin.jsx        # Doctor login page
        │   │   └── PatientAccess.jsx      # Patient access page
        │   ├── doctor/
        │   │   ├── Dashboard.jsx          # Doctor dashboard
        │   │   ├── History.jsx            # Report history
        │   │   └── NewReport.jsx          # New report creation
        │   └── patient/
        │       ├── HomePage.jsx           # Patient home
        │       ├── PatientReportDetail.jsx # Individual report view
        │       └── PatientReports.jsx     # Patient reports list
        └── routes/
            ├── AppRoutes.jsx             # Main routing logic
            ├── DoctorRoutes.jsx          # Doctor-specific routes
            └── PatientRoutes.jsx         # Patient-specific routes
```

## Key Components and Services

### AI Services (Backend)
- **ASR Service**: Converts spoken medical dictation to text
- **Dialogue Service**: Handles conversational interactions with doctors
- **Decision Tree Service**: Applies clinical decision logic
- **RAG Service**: Retrieval-Augmented Generation for context-aware responses
- **Report Generation Service**: Creates structured medical reports
- **Slot Filling Service**: Extracts clinical entities from text
- **Transcription Cleaner**: Cleans and normalizes transcribed audio

### Frontend Components
- **Doctor Interface**: Dashboard, report creation, history management
- **Patient Interface**: Report viewing and access
- **Audio Recording**: Voice input for report dictation
- **Report Editor**: Manual report editing and validation
- **Statistics Dashboard**: Performance metrics and analytics

### Core Services
- **Authentication Service**: JWT-based auth for doctors and patients
- **User Management**: Role-based access control
- **Report Management**: CRUD operations for medical reports
- **PDF Generation**: Export reports to PDF format
- **File Storage**: Handle uploads and generated files
- **Knowledge Base**: Medical knowledge management with embeddings

## Data Flow and Interactions

1. **Report Creation**:
   - Doctor dictates or enters clinical details
   - Audio processed by ASR service
   - Clinical entities extracted by slot filling
   - AI generates draft report using RAG and report generation services
   - Doctor reviews and validates the report

2. **Report Management**:
   - Reports stored in database with metadata
   - Doctors can view history and edit reports
   - Patients access their reports through secure portal

3. **AI Processing Pipeline**:
   - Raw audio → Transcription → Cleaning → Entity extraction → Report generation → Validation

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh

### Reports
- `GET /reports` - List reports
- `POST /reports` - Create new report
- `GET /reports/{id}` - Get specific report
- `PUT /reports/{id}` - Update report
- `DELETE /reports/{id}` - Delete report
- `POST /reports/{id}/pdf` - Generate PDF

### AI Services
- `POST /ai/transcribe` - Audio transcription
- `POST /ai/generate-report` - Generate report from data
- `POST /ai/dialogue` - Conversational AI interaction

### Users
- `GET /users` - List users
- `GET /users/{id}` - Get user details
- `PUT /users/{id}` - Update user

### Analytics
- `GET /analytics/stats` - Get system statistics
- `GET /analytics/reports` - Get analytics reports

## Authentication and Authorization

The system implements role-based access control:

- **Doctors**: Full access to report creation, editing, and patient data
- **Patients**: Read-only access to their own reports
- **Admin**: System administration and user management

Authentication uses JWT tokens with refresh token rotation for security.

## Database Schema/Models

### Core Models
- **User**: Base user model with roles (doctor/patient)
- **Doctor**: Extended user model for medical professionals
- **Patient**: Extended user model for patients
- **Report**: Medical report with content, metadata, and status
- **Consultation**: Medical consultation records
- **KnowledgeBase**: Medical knowledge entries with embeddings

### Relationships
- Doctor → Reports (one-to-many)
- Patient → Reports (one-to-many)
- Report → Consultation (many-to-one)
- User → Authentication tokens

## Deployment Considerations

### Environment Setup
- Python 3.8+ for backend
- Node.js 16+ for frontend
- PostgreSQL/MySQL database
- Redis for caching (optional)

### Production Deployment
- Containerize with Docker
- Use reverse proxy (nginx)
- Implement SSL/TLS
- Set up monitoring and logging
- Configure backup strategies

### Security Considerations
- Encrypt sensitive medical data
- Implement HIPAA compliance measures
- Regular security audits
- Secure API key management for AI services

### Performance Optimization
- Implement caching for frequent queries
- Use CDN for static assets
- Optimize AI model inference
- Database query optimization

---

*Note: This is a comprehensive overview based on the project structure. Many backend services and components are currently in skeleton form and require implementation.*