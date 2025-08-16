# React + NestJS + Postgres (Google Forms-like Survey App)

Full‑stack survey form app with React (frontend), NestJS (backend), and Postgres. Create forms, share links, collect responses, and view results.

## 🚀 Quick start (Docker)

```bash
# Build and start selected services (or use "all")
./scripts/build.sh all

# Or only app core
./scripts/build.sh frontend backend postgres pgadmin

## Services

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger: http://localhost:8080/api
- pgAdmin: http://localhost:5050 (admin@admin.com / admin)

## 📋 Features

### Forms Management
- Create forms with text and multiple choice questions
- Share form links publicly
- Collect anonymous responses
- View response analytics

### User Management
- User registration and authentication (JWT)
- User profile management
- Admin dashboard for user management

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Forms
- `POST /api/forms` - Create form (authenticated)
- `GET /api/forms` - List user's forms (authenticated)
- `GET /api/forms/:id` - Get form details (public)
- `POST /api/forms/:id/responses` - Submit response (public)
- `GET /api/forms/:id/responses` - View responses (authenticated, owner only)

### Users
- `GET /api/users` - List users (admin)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## 🗄️ Database Schema

```sql
-- Users
users (id, name, email, password, age, is_active, created_at, updated_at)

-- Forms
forms (id, user_id, title, created_at)
questions (id, form_id, type, text, options)
responses (id, form_id, user_id, answers, created_at)
```

## 🎨 Frontend Pages

- **Home** (`/`) - List user's forms, create new forms
- **Create Form** (`/#/create`) - Form builder with questions
- **Public Form** (`/#/form/:id`) - Anonymous form submission
- **Responses** (`/#/responses/:id`) - View form responses
- **User Management** - Admin dashboard for user CRUD

## 🔐 Authentication

JWT-based authentication with token stored in localStorage. Public form submission doesn't require authentication.

## 🚀 Quick Start

```bash
# Start all services
docker compose up -d

# Or use the build script
./scripts/build.sh all
```

Access the app at http://localhost:3000

## ♻️ Rebuild workflow

Use a single script with two modes:

```bash
# For config/env updates → SOFT (no image build)
./scripts/rebuild.sh <service|all> soft

# For code/Dockerfile changes → HARD (rebuild image)
./scripts/rebuild.sh <service|all> hard
```

Examples:

```bash
# After backend code edits
./scripts/rebuild.sh backend hard

# Recreate frontend to pick up env/static content changes
./scripts/rebuild.sh frontend soft
```

Supported services: `frontend backend postgres pgadmin`. Use `all` for everything.

## Database access

pgAdmin is included for DB administration at http://localhost:5050 (default: admin@admin.com / admin). Default Postgres connection inside Docker uses host `postgres`, port `5432`.

## 🧑‍💻 Development

### Frontend Development
```bash
cd frontend
yarn install
yarn dev
```

### Backend Development
```bash
cd backend
yarn install
yarn start:dev
```

## 🔧 Useful Commands

```bash
# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Run linting
cd backend && yarn lint
cd frontend && yarn lint

# API health check
curl http://localhost:8080/api

# Test API endpoints
./scripts/test-api.sh.sh
```

## 📁 Project Structure

```
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # JWT authentication
│   │   ├── forms/          # Forms, questions, responses
│   │   ├── users/          # User management
│   │   └── ...
│   └── ...
├── frontend/               # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/      # Form pages
│   │   │   ├── auth/       # Login/signup
│   │   │   └── dashboard/  # User management
│   │   ├── services/       # API calls
│   │   └── ...
│   └── ...
├── database/               # SQL schema
└── scripts/                # Build/deploy scripts
```

## 🛡️ Security

- JWT tokens for API authentication
- Form responses can be submitted anonymously
- Form owners can only view their own responses
- Input validation with class-validator

## 🎯 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL
- **Database**: PostgreSQL 15
- **Authentication**: JWT
- **Deployment**: Docker Compose

## 📝 License

MIT License