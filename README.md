# ShramikSync

> **A digital recruitment management platform built for Nepal's manpower and foreign-employment industry.**

ShramikSync is a planned cloud-based SaaS platform designed to digitize and streamline the recruitment workflow of manpower agencies in Nepal.

The platform aims to replace fragmented workflows based on **Excel spreadsheets, paper files, and WhatsApp** with a centralized system for candidate management, document processing, recruitment workflows, compliance, reporting, and eventually AI-powered recruitment intelligence.

The product roadmap evolves ShramikSync from a recruitment workflow management system into a broader **global recruitment operating system**.

---

## 🚀 Vision

Recruitment agencies in Nepal often depend on disconnected and manual processes for managing candidates, documents, recruitment stages, communication, and compliance.

ShramikSync aims to provide a centralized digital platform that helps agencies:

* Digitize recruitment workflows
* Reduce document-handling errors
* Improve recruiter productivity
* Track candidates throughout the recruitment lifecycle
* Improve compliance management
* Automate repetitive recruitment tasks
* Introduce AI-assisted recruitment decisions
* Connect organizations involved in foreign employment
* Eventually support recruitment operations across multiple countries

The initial product is specifically designed around the needs of Nepal's manpower industry.

---

# 🎯 Problem

Traditional recruitment workflows can involve:

* Excel spreadsheets
* Paper-based candidate files
* WhatsApp communication
* Duplicate data entry
* Missing documents
* Manual reminders
* Manual reporting
* Difficulty tracking recruitment stages
* Compliance risks
* Limited visibility into recruiter productivity

These fragmented processes increase administrative work and can slow down candidate deployment.

ShramikSync is designed to centralize these processes into a structured digital workflow.

---

# 👥 Target Users

## Agency Owners

Agency owners need to:

* Monitor business performance
* Track recruiter productivity
* Ensure compliance
* Access centralized operational information
* Generate useful reports

### Major Pain Points

* No centralized dashboard
* Missed deadlines
* Difficult reporting

---

## Recruiters

Recruiters need to:

* Process candidates efficiently
* Upload documents quickly
* Track recruitment stages
* Reduce repetitive administrative work

### Major Pain Points

* Duplicate data entry
* Missing documents
* Manual reminders

---

# 🏗️ Product Roadmap

ShramikSync is planned as a five-stage product evolution.

```text
V1
Foundation
   ↓
V2
Workflow Automation
   ↓
V3
AI Recruitment Assistant
   ↓
V4
Recruitment Ecosystem
   ↓
V5
Global Recruitment Operating System
```

---

# 📦 Version 1.0 — Foundation

### Timeline

**10 Months**

### Theme

**Digital Recruitment Workflow**

V1 establishes the core recruitment management platform and focuses on replacing manual recruitment workflows with a centralized cloud-based SaaS system.

### Core Goals

* Replace Excel-based workflows
* Reduce document-handling errors
* Improve recruiter productivity
* Help agencies stay compliant with DoFE processes
* Build trust with the first paying customers

### Planned V1 Capabilities

The V1 architecture is intended to cover:

* Candidate management
* Recruitment workflow management
* Document management
* Recruitment-stage tracking
* Authentication
* APIs
* Database management
* Compliance-related workflows
* Reporting
* Testing
* Cloud deployment

The source specifies API examples including:

```http
POST /api/auth/login
POST /api/candidates
GET /api/candidates
PUT /api/candidates/:id
DELETE /api/candidates/:id
```

### V1 Non-Functional Priorities

The system should consider:

* Security
* Performance
* Scalability
* Availability
* Reliability

### V1 Testing Strategy

Planned testing areas include:

* Unit testing
* API testing
* Integration testing
* User acceptance testing

### V1 Risks

Potential risks include:

* Agencies refusing adoption
* Low OCR accuracy
* SMS gateway costs
* Changes in government regulations

---

# ⚙️ Version 2.0 — Smart Workflow Automation

### Theme

**Automation**

Once agencies have digitized their workflows through V1, recruiters may still spend significant time performing repetitive operations.

V2 focuses on reducing this repetitive manual work through automation.

## New Modules

* OCR Expansion
* Resume Builder
* Calendar
* Email Automation
* SMS Automation
* Excel Import
* Advanced Reports

## Technical Evolution

V2 is expected to introduce:

* Database changes
* New APIs
* New services
* Background jobs
* Queues
* Cron jobs
* Migration strategy

The migration strategy should allow existing V1 customers to upgrade without losing their data.

## Example Success Metrics

The roadmap identifies potential V2 targets such as:

* **50 agencies**
* **10,000 candidates**
* **90% customer retention**

---

# 🤖 Version 3.0 — AI Recruitment Assistant

### Theme

**Artificial Intelligence**

V3 transforms ShramikSync from a workflow management platform into an intelligent recruitment assistant capable of helping agencies make faster and better decisions.

## AI Modules

Planned AI capabilities include:

* OCR
* Document Validation
* Candidate Matching
* AI Search
* Compliance Checker
* AI Chat
* Translation

## AI Architecture

The roadmap identifies the following architectural components:

```text
Documents
    │
    ▼
OCR Pipeline
    │
    ▼
Embeddings
    │
    ▼
Vector Database
    │
    ▼
RAG / AI Services
    │
    ▼
LLM
    │
    ▼
Recruitment Assistant
```

Additional AI engineering areas include:

* Prompt engineering
* RAG
* Model evaluation
* AI datasets

## AI Data & Privacy

The platform must consider:

* What recruitment data can be used
* How user data is protected
* How data is anonymized
* How AI systems are evaluated

## AI Risks

AI features introduce risks such as:

* Hallucinations
* Bias
* Incorrect OCR
* Incorrect recommendations

## AI Evaluation Metrics

Potential evaluation metrics include:

* Accuracy
* Precision
* Recall
* Response time

---

# 🌐 Version 4.0 — Recruitment Ecosystem

### Theme

**Connected Platform**

V4 expands ShramikSync beyond manpower agencies into a connected ecosystem for organizations involved in foreign employment.

The vision is to allow organizations involved in recruitment and foreign employment to collaborate through a single digital ecosystem.

## New Users

Potential ecosystem participants include:

* Manpower agencies
* Medical centers
* Orientation centers
* Employers
* Auditors
* Government organizations *(future)*

## New Modules

* Employer Portal
* Medical Portal
* Orientation Portal
* API Platform
* Accounting
* HR
* Workflow Builder

## System Architecture

V4 introduces a broader platform architecture involving:

* Multi-portal architecture
* Permission management
* API Gateway
* Rate limiting
* Audit systems

## Business Model

Potential revenue models include:

* Subscription
* Marketplace
* Transaction fees
* Enterprise plans

---

# 🌍 Version 5.0 — Global Recruitment Operating System

### Theme

**Global Expansion**

The long-term vision is to transform ShramikSync into a recruitment operating system capable of supporting multiple countries while allowing each country to maintain its own recruitment rules, compliance processes, and workflows.

## Internationalization

The platform is designed to eventually support:

* Multiple countries
* Multiple languages
* Multiple currencies
* Country-specific compliance rules
* Visa rules
* Country-specific document types

---

# 🧩 Country Rules Engine

A key V5 architectural concept is avoiding hard-coded country-specific business logic.

Instead of building logic like:

```text
if country == Nepal
    ...
```

the platform should use configurable rules.

### Proposed Architecture

```text
Country Rules
      │
      ▼
Validation Engine
      │
      ▼
Workflow Engine
      │
      ▼
Document Rules
      │
      ▼
Visa Rules
```

This approach allows new countries to be supported primarily through configuration rather than rewriting the core business logic.

---

# 🏢 Enterprise Capabilities

The V5 roadmap identifies the following enterprise capabilities:

* Multi-region deployment
* White-label support
* Enterprise SSO
* Public APIs
* Advanced audit and compliance
* Disaster recovery

---

# 🧠 Future AI Evolution

The AI layer is expected to evolve toward predictive intelligence.

Potential capabilities include:

* Predictive analytics
* Demand forecasting
* Recruitment trend analysis
* Risk analysis
* Business intelligence

---

# 🏛️ High-Level Architecture

The roadmap suggests an architecture that progressively evolves from a core SaaS platform into an automated, AI-powered, multi-portal ecosystem.

```text
                         ┌─────────────────────┐
                         │     Web Clients     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Authentication   │
                         │   & Permissions    │
                         └──────────┬──────────┘
                                    │
                                    ▼
                    ┌────────────────────────────┐
                    │      Core Platform         │
                    │                            │
                    │ Candidate Management       │
                    │ Recruitment Workflows      │
                    │ Documents                  │
                    │ Compliance                 │
                    │ Reporting                  │
                    └─────────────┬──────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
           Automation          AI Layer       Integrations
                 │                │                │
                 ▼                ▼                ▼
          Background Jobs     OCR / RAG       Email / SMS
          Queues              AI Search       External APIs
          Cron Jobs           Matching
                              Validation
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Ecosystem Layer  │
                         │                  │
                         │ Employers        │
                         │ Medical Centers  │
                         │ Orientation      │
                         │ Auditors         │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Global Platform  │
                         │                  │
                         │ Country Rules    │
                         │ Visa Rules       │
                         │ Multi-region     │
                         │ Enterprise       │
                         └──────────────────┘
```

> **Note:** This is a conceptual architecture derived from the product roadmap. The source does not define a final programming language, framework, database engine, cloud provider, or infrastructure implementation.

---

# 🔐 Security & Compliance

Security is a core non-functional requirement from the foundation stage.

The product roadmap identifies:

* Security
* Authentication
* Permission management
* Audit capabilities
* Compliance workflows
* Advanced audit and compliance for enterprise deployments

The platform is also intended to help Nepalese manpower agencies stay aligned with relevant **DoFE processes**.

---

# 🧪 Testing

The testing strategy is expected to evolve with the platform.

### V1

```text
Unit Testing
     ↓
API Testing
     ↓
Integration Testing
     ↓
User Acceptance Testing
```

As the platform evolves, additional testing will be required for:

* Automation workflows
* Background jobs
* AI systems
* Multi-portal access
* Country-specific rules
* Enterprise integrations
* Disaster recovery

The exact testing frameworks are not specified in the source.

---

# 📊 Product Evolution

| Version | Theme      | Primary Objective                                        |
| ------- | ---------- | -------------------------------------------------------- |
| **V1**  | Foundation | Digitize recruitment workflows                           |
| **V2**  | Automation | Reduce repetitive manual work                            |
| **V3**  | AI         | Provide intelligent recruitment assistance               |
| **V4**  | Ecosystem  | Connect organizations involved in recruitment            |
| **V5**  | Global     | Build a configurable global recruitment operating system |

---

# 🗺️ Roadmap

```text
┌───────────────────────────────────────────────────────────┐
│ V1 — FOUNDATION                                           │
│ Digital recruitment workflow                              │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ V2 — AUTOMATION                                           │
│ OCR • Resume • Calendar • Email • SMS • Reports           │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ V3 — AI RECRUITMENT ASSISTANT                             │
│ OCR • Matching • Search • Compliance • Chat • Translation │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ V4 — RECRUITMENT ECOSYSTEM                                │
│ Employers • Medical • Orientation • APIs • Accounting     │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│ V5 — GLOBAL RECRUITMENT OPERATING SYSTEM                  │
│ Countries • Rules • Visa • Enterprise • AI Analytics      │
└───────────────────────────────────────────────────────────┘
```

---

# 📌 Project Status

**Current roadmap:** Version 1.0 → Version 5.0

**Initial target market:** Nepalese manpower and foreign-employment agencies

**Initial product direction:** Cloud-based recruitment SaaS

**Long-term direction:** Global recruitment operating system

The roadmap does not provide a definitive implementation status for individual software modules, so module availability should be tracked separately from this product vision.

---

# 🛠️ Technology Stack

The supplied product notes define architectural requirements but **do not specify a finalized technology stack**.

Therefore, the following should be documented here once the implementation is finalized:

```text
Frontend:
TBD

Backend:
TBD

Database:
TBD

Authentication:
TBD

Cloud / Infrastructure:
TBD

AI / ML:
TBD

Storage:
TBD

CI/CD:
TBD

Monitoring:
TBD
```

Do not replace these with assumed technologies unless they are actually used by the project.

---

# 📁 Suggested Repository Structure

A possible repository organization for the platform is:

```text
shramiksync/
│
├── frontend/
│
├── backend/
│
├── services/
│
├── database/
│
├── docs/
│
├── tests/
│
├── scripts/
│
├── .env.example
├── .gitignore
├── README.md
└── LICENSE
```

> This is a recommended repository structure, not a structure specified in the original roadmap.

---

# 🚀 Getting Started

Installation and deployment instructions should be added once the implementation stack is finalized.

A production README should eventually document:

1. Prerequisites
2. Repository setup
3. Environment variables
4. Database setup
5. Backend installation
6. Frontend installation
7. Local development
8. Testing
9. Build process
10. Deployment

Example:

```bash
# Clone repository
git clone <repository-url>

# Enter project
cd shramiksync

# Install dependencies
# Add project-specific commands here

# Configure environment
cp .env.example .env

# Start development environment
# Add project-specific command here
```

---

# 🔑 Environment Variables

Once implementation begins, sensitive configuration should be managed through environment variables rather than committed to Git.

Example:

```env
DATABASE_URL=
JWT_SECRET=
STORAGE_URL=
EMAIL_API_KEY=
SMS_API_KEY=
AI_API_KEY=
```

> These are placeholders only. Actual variables should reflect the implemented system.

Never commit:

```text
.env
*.pem
*.key
credentials.json
API keys
database passwords
private certificates
```

---

# 🤝 Contribution

Contributions should follow the project's development standards.

Before submitting changes:

1. Create a feature branch.
2. Implement the change.
3. Add or update tests where applicable.
4. Verify the application locally.
5. Commit changes using clear commit messages.
6. Push the branch.
7. Open a Pull Request.
8. Request review before merging into the main branch.

Example:

```bash
git checkout -b feature/candidate-management

git add .

git commit -m "feat: add candidate management"

git push origin feature/candidate-management
```

---

# 🌿 Recommended Git Branching Strategy

For a growing SaaS project, a simple branch structure is recommended:

```text
main
 │
 ├── develop
 │    │
 │    ├── feature/authentication
 │    ├── feature/candidates
 │    ├── feature/documents
 │    └── feature/reporting
 │
 └── hotfix/*
```

### Branches

| Branch      | Purpose                 |
| ----------- | ----------------------- |
| `main`      | Production-ready code   |
| `develop`   | Integration branch      |
| `feature/*` | New functionality       |
| `hotfix/*`  | Urgent production fixes |

---

# 📝 Commit Convention

Use meaningful conventional commit messages.

Examples:

```text
feat: add candidate management
feat: implement document upload
fix: resolve candidate validation issue
docs: update API documentation
refactor: improve recruitment service
test: add candidate API tests
chore: update dependencies
```

Avoid commits such as:

```text
update
changes
final
final2
new
working
test
asdf
```

Clear commit history matters once multiple developers are working on the repository.

---

# 📚 Documentation

The project should eventually maintain dedicated documentation for:

* Product requirements
* System architecture
* Database design
* API documentation
* Authentication
* UI/UX
* Deployment
* Testing
* Security
* AI architecture
* Compliance
* Country rules
* Developer onboarding

The original roadmap explicitly identifies architecture, database design, UI design, API documentation, testing, risks, and future scope as important project documentation areas.

---

# ⚠️ Important Product Risks

ShramikSync's roadmap identifies several significant risks:

### Adoption Risk

Agencies may be unwilling to change existing workflows.

### OCR Risk

Poor OCR accuracy could result in incorrect candidate or document information.

### Communication Costs

SMS infrastructure can introduce ongoing operational costs.

### Regulatory Risk

Changes in government regulations may require workflow and compliance updates.

### AI Risk

Future AI functionality introduces risks including:

* Hallucination
* Bias
* Incorrect OCR
* Incorrect recommendations

## These risks should be considered during architecture and product development rather than after implementation.

# 🔮 Future Scope

ShramikSync's long-term roadmap extends beyond the initial Nepal-focused SaaS platform.

Future capabilities include:

* AI-powered recruitment assistance

* Candidate matching

* AI search

* Compliance checking

* Translation

* Employer portals

* Medical-center portals

* Orientation-center portals

* API platform

* Accounting and HR functionality

* Workflow builder

* Multi-country support

* Multi-language support

* Multi-currency support

* Country-specific rules

* Visa rules

* Enterprise SSO

* White-label deployments

* Public APIs

* Multi-region infrastructure

* Disaster recovery

* Predictive analytics

* Recruitment demand forecasting

* Recruitment trend analysis

* Risk analysis

* Business intelligence

---

# 📄 License

Add the project's actual license here once it has been selected.

Example:

```text
MIT License
```

Do not claim an MIT or other license until the repository actually uses that license.

---

# 👨‍💻 Project Philosophy

ShramikSync is being designed around a simple progression:

```text
Digitize
   ↓
Automate
   ↓
Intelligent Assistance
   ↓
Connect the Ecosystem
   ↓
Globalize
```

The goal is not simply to replace spreadsheets with another CRUD application.

The long-term architecture is intended to evolve from a **recruitment workflow platform** into a configurable system capable of handling different organizations, recruitment processes, compliance requirements, countries, and AI-assisted decision-making.

---

## 📈 Long-Term Vision

> **From managing candidates to powering the global recruitment lifecycle.**

ShramikSync begins with Nepal's manpower industry and aims to build the infrastructure required for a broader international recruitment ecosystem.
