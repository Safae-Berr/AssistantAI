# MedAI Radiology Frontend

A modern React application for the MedAI Radiology platform, built with Vite and featuring separate portals for healthcare professionals and patients.

## Features

- **Doctor Portal**: Dashboard for creating and managing medical reports
- **Patient Portal**: Secure access to personal medical reports
- **Authentication**: JWT-based auth with MFA support for doctors
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **State Management**: Redux Toolkit for complex application state
- **Type Safety**: TypeScript support for better development experience

## Tech Stack

- **React 19** - Modern JavaScript library
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Lucide React** - Icon library

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development Servers

#### Doctor Portal (Default)
```bash
npm run dev
```
Runs on http://localhost:5173

#### Patient Portal
```bash
npm run dev:patient
```

Runs on http://localhost:5174

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── layout/         # Layout components (nav, footer)
│   ├── reports/        # Report-related components
│   └── ui/             # Base UI components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── doctor/         # Doctor portal pages
│   └── patient/        # Patient portal pages
├── routes/             # Routing configuration
├── store/              # Redux store and slices
├── hooks/              # Custom React hooks
└── services/           # API service functions
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PORTAL=doctor  # or 'patient'
```

## Authentication Flow

The application supports two authentication flows:

1. **Doctors**: Email/password with optional MFA
2. **Patients**: Access code + birth date

Authentication state is managed globally using Redux and persisted in HTTP-only cookies.

## Contributing

1. Follow the existing code style and structure
2. Use TypeScript for new components when possible
3. Ensure responsive design for mobile devices
4. Test authentication flows thoroughly
5. Follow React best practices and hooks guidelines
