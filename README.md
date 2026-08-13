# ShramikSync

> **AI-Powered Recruitment Management Platform for Nepal's Foreign Employment Industry**

ShramikSync is a **MERN-based Recruitment Management Platform** designed specifically for Nepal's manpower and foreign-employment industry.

The platform is being built to replace fragmented recruitment processes involving spreadsheets, paper records, email, and messaging applications with a centralized digital system for managing candidates, documents, employer demands, recruitment workflows, notifications, reporting, and compliance.

## ShramikSync V1 focuses exclusively on the **Nepalese recruitment industry**, while the long-term roadmap expands the platform toward workflow automation, AI-assisted recruitment, ecosystem integration, and eventually a global recruitment operating system.

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem](#-problem)
* [Vision](#-vision)
* [Objectives](#-objectives)
* [Target Users](#-target-users)
* [Core V1 Features](#-core-v1-features)
* [Technology Stack](#-technology-stack)
* [System Architecture](#-system-architecture)
* [Project Structure](#-project-structure)
* [Frontend Architecture](#-frontend-architecture)
* [Backend Architecture](#-backend-architecture)
* [Database](#-database)
* [Authentication](#-authentication)
* [API Structure](#-api-structure)
* [Environment Variables](#-environment-variables)
* [Getting Started](#-getting-started)
* [Development Workflow](#-development-workflow)
* [Git Workflow](#-git-workflow)
* [Testing](#-testing)
* [Security](#-security)
* [V1 Roadmap](#-v1-roadmap)
* [Long-Term Product Roadmap](#-long-term-product-roadmap)
* [Risks](#-risks)
* [Future Scope](#-future-scope)
* [Project Status](#-project-status)
* [Contributing](#-contributing)
* [License](#-license)

---

# 🌐 Overview

Foreign employment is a major part of Nepal's economy, with Nepalese workers seeking employment in countries including Qatar, Saudi Arabia, the UAE, Malaysia, Japan, and South Korea.

Despite the importance of this industry, many recruitment agencies continue to rely on disconnected tools such as:

* Microsoft Excel
* Paper files
* Email
* WhatsApp
* Manual records
* Separate government systems

As recruitment volume increases, these processes create operational problems including duplicated data, lost documents, delayed processing, poor visibility, and compliance risks.

ShramikSync is designed to provide a centralized digital platform that manages the recruitment lifecycle inside the agency.

---

# ❗ Problem

Nepal's recruitment agencies face several operational challenges.

### Current Problems

* Heavy dependence on spreadsheets and paper records
* Candidate information spread across multiple systems
* Duplicate data entry
* Manual document processing
* Difficulty tracking candidates throughout the recruitment lifecycle
* Poor visibility into recruiter performance
* Difficulty tracking employer demand fulfillment
* Missed deadlines
* Limited collaboration between teams
* Lack of centralized reporting
* Compliance and documentation challenges

These issues can result in:

```text
Manual Processes
       ↓
Duplicate Work
       ↓
Data Errors
       ↓
Delayed Processing
       ↓
Higher Administrative Costs
       ↓
Compliance Risk
       ↓
Reduced Service Quality
```

---

# 💡 Solution

ShramikSync centralizes recruitment operations into one platform.

```text
Candidates
     │
Documents
     │
Employer Demands
     │
Recruitment Workflows
     │
Notifications
     │
Reporting
     │
Compliance
     │
     ▼
┌───────────────────────────┐
│       ShramikSync         │
│ Recruitment Management   │
│        Platform           │
└───────────────────────────┘
```

The goal is to replace fragmented manual workflows with an integrated cloud-based recruitment management system.

---

# 🎯 Vision

### Short-Term Vision

Build a secure, scalable, and user-friendly recruitment management platform specifically for Nepal's manpower industry.

### Long-Term Vision

Transform ShramikSync from a recruitment management platform into a:

> **Global Recruitment Operating System**

The planned progression is:

```text
Digital Recruitment
        ↓
Workflow Automation
        ↓
AI Recruitment Assistant
        ↓
Recruitment Ecosystem
        ↓
Global Recruitment Operating System
```

---

# 🎯 Objectives

The project aims to:

* Replace spreadsheet-based recruitment workflows
* Digitize paper-based recruitment processes
* Reduce document-handling errors
* Improve recruiter productivity
* Centralize applicant information
* Improve recruitment tracking
* Improve collaboration between teams
* Improve reporting and operational visibility
* Support compliance workflows
* Provide a scalable technical foundation
* Establish a foundation for future AI capabilities
* Build a commercially viable software product

These objectives are directly aligned with the V1 project definition.

---

# 👥 Target Users

## Agency Owners

Agency owners need visibility into:

* Business performance
* Recruiter productivity
* Candidate processing
* Employer demand fulfillment
* Compliance
* Operational reporting

---

## Recruiters

Recruiters need to:

* Register candidates
* Manage candidate information
* Upload documents
* Track recruitment stages
* Monitor deadlines
* Process candidates efficiently

---

## Documentation Officers

Documentation teams need to:

* Manage candidate documents
* Track missing documents
* Verify documentation
* Maintain organized records

---

## Management

Management needs:

* Centralized reports
* Recruitment analytics
* Operational visibility
* Compliance monitoring
* Performance information

---

# 🚀 Core V1 Features

ShramikSync V1 focuses on the core recruitment management lifecycle.

## 1. Candidate Management

Centralize candidate information and track candidates throughout the recruitment lifecycle.

Potential capabilities:

* Candidate registration
* Candidate profiles
* Candidate search
* Candidate filtering
* Candidate status
* Recruiter assignment
* Candidate lifecycle tracking

---

## 2. Document Management

Centralize recruitment-related documents.

The system is intended to reduce problems caused by paper-based and fragmented document management.

Potential capabilities:

* Document upload
* Document categorization
* Document status
* Missing-document tracking
* Candidate-document association
* Document verification workflow

---

## 3. Employer Demand Management

Manage employer requirements and recruitment demand.

Potential capabilities:

* Employer information
* Demand letters
* Job requirements
* Vacancy information
* Candidate-demand association
* Demand fulfillment tracking

The source explicitly identifies employer demand letters as part of the centralized platform.

---

## 4. Recruitment Workflow

Track candidates through the recruitment lifecycle.

A conceptual workflow is:

```text
Registration
     ↓
Document Collection
     ↓
Processing
     ↓
Medical
     ↓
Orientation
     ↓
Visa Processing
     ↓
Deployment
```

The exact workflow states should remain configurable as the implementation develops.

---

## 5. Notifications & Reminders

Recruitment agencies can face missed deadlines involving:

* Passport renewals
* Visa processing
* Medical examinations
* Orientation programs

ShramikSync aims to provide centralized tracking and reminder capabilities for these activities.

---

## 6. Reporting

Centralized reporting is intended to improve operational planning and decision-making.

Potential reporting areas include:

* Candidate pipeline
* Recruitment progress
* Recruiter productivity
* Employer demand fulfillment
* Pending documents
* Recruitment status

---

## 7. Compliance Tracking

ShramikSync is intended to help agencies maintain consistent compliance with relevant foreign-employment regulations and documentation requirements.

The V1 project specifically identifies compliance with Nepal's foreign-employment requirements as a core objective.

> ShramikSync should not be described as a replacement for government compliance systems unless an actual integration has been implemented.

---

# 🧰 Technology Stack

ShramikSync is being developed as a **MERN full-stack application**.

## Frontend

| Technology | Purpose               |
| ---------- | --------------------- |
| React      | UI development        |
| Vite       | Frontend tooling      |
| TypeScript | Type-safe development |

## Backend

| Technology | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | JavaScript runtime            |
| Express.js | REST API framework            |
| TypeScript | Type-safe backend development |

## Database

| Technology | Purpose          |
| ---------- | ---------------- |
| MongoDB    | Primary database |
| Mongoose   | MongoDB ODM      |

## Authentication

| Technology | Purpose          |
| ---------- | ---------------- |
| JWT        | Authentication   |
| bcrypt     | Password hashing |

## API

```text
REST API
```

## Future Technologies

The following are planned for later stages and are **not considered part of the current core implementation unless explicitly added**:

* OCR
* AI/LLM services
* Vector databases
* RAG
* Background queues
* Cron jobs
* Email automation
* SMS automation
* External integrations
* Multi-country rules engine

---

# 🏗️ System Architecture

The current architecture is designed to separate the frontend, backend, and database.

```text
                    ┌──────────────────────┐
                    │      User / Browser   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ React + Vite + TS    │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Node.js + Express    │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
          Controllers      Services       Middleware
                │              │              │
                └──────────────┼──────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Mongoose        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    └──────────────────────┘
```

---

# 📁 Project Structure

The repository is organized as a full-stack monorepo:

```text
shramiksync/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── middleware/
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│
├── .gitignore
└── README.md
```

---

# 🎨 Frontend Architecture

The public-facing homepage follows an enterprise SaaS design direction.

### Public Website

```text
Home
 ├── Hero
 ├── Problem
 ├── Solution
 ├── Features
 ├── Product Showcase
 ├── User Solutions
 ├── Nepal Focus
 ├── Roadmap
 └── CTA
```

### Application

After authentication, the application can evolve into:

```text
Dashboard
│
├── Candidates
├── Documents
├── Employers
├── Demands
├── Recruitment Workflow
├── Notifications
├── Reports
└── Settings
```

The public homepage and authenticated application should remain separate experiences.

---

# ⚙️ Backend Architecture

The backend follows a layered Express architecture.

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Model
   ↓
MongoDB
```

### Routes

Responsible for defining API endpoints.

### Middleware

Responsible for concerns such as:

* Authentication
* Authorization
* Error handling
* Request processing
* Validation

### Controllers

Handle HTTP requests and responses.

### Services

Contain business logic.

### Models

Define MongoDB/Mongoose data structures.

This separation prevents business logic from becoming tightly coupled to Express route handlers.

---

# 🗄️ Database

MongoDB is the planned primary database for the MERN implementation.

The database will eventually contain collections/entities around:

```text
Organization
User
Candidate
Document
Employer
Demand
RecruitmentWorkflow
Notification
Report
```

The exact schema, indexes, relationships, and constraints should be finalized during implementation rather than invented in advance.

The product documentation identifies database design as including fields, relationships, indexes, constraints, and business rules.

---

# 🔐 Authentication

Authentication will be implemented using:

```text
React
   ↓
POST /api/auth/login
   ↓
Express
   ↓
User Verification
   ↓
bcrypt Password Validation
   ↓
JWT
   ↓
Authenticated User
```

Planned authentication capabilities:

* User registration
* Login
* Logout
* Password hashing
* JWT-based authentication
* Protected routes
* Role-based authorization
* Current-user endpoint

The exact token-storage strategy should be finalized during implementation with security considerations rather than copied blindly from a template.

---

# 🛂 Authorization

The platform will eventually support role-based access control.

Possible roles include:

```text
OWNER
ADMIN
MANAGER
RECRUITER
DOCUMENTATION_OFFICER
```

Permissions should be based on actual business requirements.

For example:

```text
OWNER
 ├── Organization settings
 ├── Users
 ├── Reports
 └── Full access

RECRUITER
 ├── Candidates
 ├── Documents
 └── Recruitment workflow

DOCUMENTATION_OFFICER
 ├── Documents
 └── Verification workflow
```

These roles are implementation-level design decisions and should be refined as requirements become more specific.

---

# 🔌 API Structure

The API will follow a REST-oriented structure.

```text
/api
│
├── /auth
│
├── /users
│
├── /candidates
│
├── /documents
│
├── /employers
│
├── /demands
│
├── /workflows
│
├── /notifications
│
└── /reports
```

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Candidates

```http
POST   /api/candidates
GET    /api/candidates
GET    /api/candidates/:id
PUT    /api/candidates/:id
DELETE /api/candidates/:id
```

The original product documentation provides candidate CRUD examples including:

```http
POST /api/candidates
GET /api/candidates
PUT /api/candidates/:id
DELETE /api/candidates/:id
```

Additional endpoints should be documented when they are actually implemented.

---

# ❤️ Health Check

The backend provides a basic health endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "ShramikSync API is running"
}
```

---

# 🔑 Environment Variables

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/shramiksync

JWT_SECRET=your_secret_here

CLIENT_URL=http://localhost:5173
```

Create `.env.example` for the repository:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

JWT_SECRET=

CLIENT_URL=http://localhost:5173
```

### Never commit

```text
.env
API keys
JWT secrets
Database credentials
Private keys
Cloud credentials
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js
* npm
* MongoDB
* Git

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd shramiksync
```

---

## 2. Setup Backend

```bash
cd backend
npm install
```

Create:

```text
.env
```

Configure the required environment variables.

---

## 3. Start MongoDB

Make sure your local MongoDB server is running.

Default development database:

```text
mongodb://127.0.0.1:27017/shramiksync
```

---

## 4. Start Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## 5. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔄 Development Workflow

During development:

```text
Developer
    │
    ├── React / TypeScript
    │
    ▼
Frontend
    │
    │ REST API
    ▼
Express Backend
    │
    ▼
Services
    │
    ▼
Mongoose
    │
    ▼
MongoDB
```

Frontend and backend should be developed independently but integrated through documented APIs.

---

# 🌿 Git Workflow

Recommended branch structure:

```text
main
 │
 ├── develop
 │
 ├── feature/authentication
 ├── feature/candidates
 ├── feature/documents
 ├── feature/employers
 ├── feature/workflows
 │
 └── hotfix/*
```

### Branches

| Branch      | Purpose                 |
| ----------- | ----------------------- |
| `main`      | Production-ready code   |
| `develop`   | Development integration |
| `feature/*` | New features            |
| `hotfix/*`  | Urgent fixes            |

---

# 📝 Commit Convention

Use meaningful commit messages.

Examples:

```text
feat: add candidate management
feat: implement authentication
feat: add document upload
fix: resolve candidate validation
fix: resolve authentication middleware
docs: update API documentation
refactor: separate candidate service
test: add candidate API tests
chore: update dependencies
```

Avoid meaningless commits such as:

```text
update
changes
final
final2
test
new
working
```

---

# 🧪 Testing

V1 testing should cover:

* Unit testing
* API testing
* Integration testing
* User acceptance testing

These testing categories are explicitly identified in the project roadmap.

Future testing will also need to cover:

* Authentication
* Authorization
* Candidate workflows
* Document workflows
* Notifications
* Database operations
* API security
* AI services
* External integrations

---

# 🔒 Security

Security is a core non-functional requirement of the platform.

The project identifies:

* Security
* Performance
* Scalability
* Availability
* Reliability

as important platform requirements.

Current implementation should follow basic security practices including:

* Password hashing
* Environment-based secrets
* Authentication middleware
* Authorization
* Request validation
* Secure CORS configuration
* HTTP security headers
* Error handling
* No secrets in Git

As the platform grows, security requirements will need to become significantly more comprehensive.

---

# 📊 Non-Functional Requirements

ShramikSync should be designed with the following requirements in mind:

### Security

Protect candidate and organizational data.

### Performance

Maintain responsive API and UI performance.

### Scalability

Allow the system to support increasing numbers of agencies, users, and candidates.

### Availability

Keep the platform accessible for recruitment operations.

### Reliability

Ensure recruitment data and workflows remain consistent and dependable.

These requirements are part of the V1 technical architecture requirements.

---

# 🗺️ V1 Development Roadmap

V1 is the current foundation of ShramikSync.

## Phase 1 — Foundation

* [x] React + Vite + TypeScript frontend
* [x] Node.js + Express backend foundation
* [x] MongoDB connection
* [x] Environment configuration
* [x] API health check

## Phase 2 — Authentication

* [ ] User model
* [ ] Organization model
* [ ] Registration
* [ ] Login
* [ ] JWT authentication
* [ ] Protected routes
* [ ] Role-based authorization

## Phase 3 — Candidate Management

* [ ] Candidate model
* [ ] Candidate registration
* [ ] Candidate listing
* [ ] Candidate search
* [ ] Candidate filtering
* [ ] Candidate details
* [ ] Candidate status
* [ ] Recruiter assignment

## Phase 4 — Documents

* [ ] Document model
* [ ] Document upload
* [ ] Document categories
* [ ] Document status
* [ ] Missing document tracking
* [ ] Document verification

## Phase 5 — Employer & Demand Management

* [ ] Employer model
* [ ] Demand model
* [ ] Demand management
* [ ] Job requirements
* [ ] Candidate-demand association
* [ ] Demand fulfillment tracking

## Phase 6 — Recruitment Workflow

* [ ] Workflow model
* [ ] Recruitment stages
* [ ] Candidate status transitions
* [ ] Workflow tracking
* [ ] Deadline tracking

## Phase 7 — Notifications

* [ ] Notification model
* [ ] In-app notifications
* [ ] Reminder system
* [ ] Deadline alerts

## Phase 8 — Reporting

* [ ] Candidate reports
* [ ] Recruitment pipeline reports
* [ ] Recruiter productivity
* [ ] Demand fulfillment
* [ ] Operational dashboard

## Phase 9 — Testing & Deployment

* [ ] Unit tests
* [ ] API tests
* [ ] Integration tests
* [ ] User acceptance testing
* [ ] Production deployment
* [ ] Monitoring

---

# 🛣️ Long-Term Product Roadmap

## V1 — Foundation

### Theme

**Digital Recruitment Management**

V1 focuses on replacing fragmented recruitment workflows with a centralized platform.

---

## V2 — Smart Workflow Automation

### Theme

**Automation**

V2 focuses on reducing repetitive manual work.

Planned modules include:

* OCR expansion
* Resume builder
* Calendar
* Email automation
* SMS automation
* Excel import
* Advanced reports
* Background jobs
* Queues
* Cron jobs

The roadmap also calls for migration strategies that allow V1 customers to upgrade without losing their data.

---

# 🤖 V3 — AI Recruitment Assistant

### Theme

**Artificial Intelligence**

The goal is to transform ShramikSync into an intelligent recruitment assistant.

Planned capabilities include:

* OCR
* Document validation
* Candidate matching
* AI search
* Compliance checker
* AI chat
* Translation

Potential AI architecture:

```text
Documents
    ↓
OCR Pipeline
    ↓
Embeddings
    ↓
Vector Database
    ↓
RAG
    ↓
LLM
    ↓
AI Recruitment Assistant
```

The roadmap also identifies:

* Prompt engineering
* Model evaluation
* AI datasets
* Privacy
* Data anonymization

as important AI architecture considerations.

---

# 🌐 V4 — Recruitment Ecosystem

### Theme

**Connected Platform**

V4 expands ShramikSync beyond recruitment agencies.

Potential ecosystem users include:

* Medical centers
* Orientation centers
* Employers
* Auditors
* Government organizations *(future)*

Potential modules:

* Employer Portal
* Medical Portal
* Orientation Portal
* API Platform
* Accounting
* HR
* Workflow Builder

The technical architecture is expected to evolve toward:

* Multi-portal architecture
* Permission management
* API gateway
* Rate limiting
* Audit systems

---

# 🌍 V5 — Global Recruitment Operating System

### Theme

**Global Expansion**

The long-term goal is to support recruitment across multiple countries while allowing each country to maintain its own:

* Recruitment rules
* Compliance processes
* Workflows
* Visa rules
* Document types
* Languages
* Currencies

---

# 🧩 Country Rules Engine

Instead of hard-coding country-specific logic:

```text
if country == Nepal
```

the long-term architecture should use configurable rules.

```text
Country Rules
      ↓
Validation Engine
      ↓
Workflow Engine
      ↓
Document Rules
      ↓
Visa Rules
```

This allows additional countries to be supported through configuration rather than rewriting core business logic.

---

# 🏢 Enterprise Features

The V5 roadmap identifies:

* Multi-region deployment
* White-label support
* Enterprise SSO
* Public APIs
* Advanced audit and compliance
* Disaster recovery

---

# 🧠 AI Evolution

Future AI capabilities may include:

* Predictive analytics
* Demand forecasting
* Recruitment trends
* Risk analysis
* Business intelligence

---

# ⚠️ Risks

ShramikSync's product roadmap identifies several important risks.

## Adoption

Agencies may be reluctant to replace familiar manual processes.

## OCR Accuracy

Incorrect OCR could result in incorrect candidate or document information.

## SMS Costs

Automated communication can introduce ongoing gateway costs.

## Regulatory Changes

Changes in government regulations can require changes to recruitment workflows.

## AI Risks

Future AI functionality introduces risks including:

* Hallucinations
* Bias
* Incorrect OCR
* Incorrect recommendations

---

# 📈 Product Evolution

```text
┌──────────────────────────┐
│ V1                       │
│ Recruitment Foundation   │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ V2                       │
│ Workflow Automation      │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ V3                       │
│ AI Recruitment Assistant │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ V4                       │
│ Recruitment Ecosystem    │
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ V5                       │
│ Global Recruitment OS    │
└──────────────────────────┘
```

---

# 📊 Version Comparison

| Version | Theme      | Main Focus                         |
| ------- | ---------- | ---------------------------------- |
| **V1**  | Foundation | Recruitment management             |
| **V2**  | Automation | Reduce repetitive work             |
| **V3**  | AI         | Intelligent recruitment assistance |
| **V4**  | Ecosystem  | Connect recruitment organizations  |
| **V5**  | Global     | Multi-country recruitment platform |

---

# 📌 Current Project Status

### Current Development Stage

**ShramikSync V1 — Foundation**

### Current Stack

```text
Frontend
React
Vite
TypeScript

Backend
Node.js
Express
TypeScript

Database
MongoDB
Mongoose

Authentication
JWT
bcrypt
```

### Current Priorities

```text
1. Full-stack foundation
2. Authentication
3. Organization & user management
4. Candidate management
5. Document management
6. Employer & demand management
7. Recruitment workflow
8. Notifications
9. Reporting
10. Testing & deployment
```

### Future Features

AI, advanced automation, ecosystem portals, multi-country support, and global recruitment capabilities remain part of the future roadmap rather than the current V1 implementation.

---

# 📚 Documentation

The project should maintain documentation for:

```text
docs/
├── architecture/
├── database/
├── api/
├── authentication/
├── workflows/
├── ui/
├── testing/
├── deployment/
└── product/
```

Documentation should evolve alongside implementation.

The original product roadmap identifies technical architecture, database design, UI design, API documentation, testing, risks, and future scope as important project documentation areas.

---

# 🤝 Contributing

Contributions should follow the project's development workflow.

### Before opening a Pull Request

1. Create a feature branch.
2. Implement the feature.
3. Update relevant documentation.
4. Add tests where appropriate.
5. Run the application locally.
6. Verify the API and frontend.
7. Commit using meaningful commit messages.
8. Push the branch.
9. Open a Pull Request.

Example:

```bash
git checkout -b feature/candidate-management

git add .

git commit -m "feat: add candidate management"

git push origin feature/candidate-management
```

---

# 📜 License

The project's final license has not yet been specified.

Add the selected license here once it has been formally chosen.

---

# 🇳🇵 ShramikSync

### **Digitizing Nepal's Foreign Employment Recruitment Operations**

ShramikSync starts with a focused problem:

> Recruitment agencies need a better way to manage candidates, documents, workflows, and compliance.

The V1 platform focuses on solving that problem with a centralized recruitment management system.

The long-term vision is much larger:

```text
Nepal Recruitment
       ↓
Digital Operations
       ↓
Automation
       ↓
AI
       ↓
Connected Ecosystem
       ↓
Global Recruitment Operating System
```

**Build the foundation first. Scale the intelligence later.**
