# Hariom Pipe Industries Limited — Platform Architecture & System Blueprint

## 1. High-Level System Architecture

The Hariom Pipe Industries platform is designed as an enterprise-grade, multi-tier web application built on the MERN/Next.js stack:

```
[ Clients: Web / Mobile Browser ]
             │
             ├── HTTPS Requests / Dynamic Rendering
             v
┌──────────────────────────────────────────────────────────┐
│                   NEXT.JS FRONTEND APP                   │
│   (App Router, React 19, Tailwind CSS, TypeScript)       │
│                                                          │
│  - Presentation Layer & Interactive UI Components        │
│  - Product Explorer & Specification Filters             │
│  - Interactive Product Finder & Comparison Engines       │
│  - Request Quote & Dealer Application Workflows          │
│  - Investor Document Center & News Hub                   │
│  - Mobile Navigation & Micro-Interactions                │
└────────────────────────────┬─────────────────────────────┘
                             │
                             │ REST API Calls (JSON)
                             v
┌──────────────────────────────────────────────────────────┐
│                   EXPRESS REST API BACKEND               │
│         (Node.js, Express.js, TypeScript, Mongoose)      │
│                                                          │
│  - API Routing & Route Controllers                       │
│  - JWT Authentication & Role-Based Authorization         │
│  - Input Validation & Sanitization (Rate Limiter, Helmet)│
│  - Enquiry & Quote Generation Engines (HPIL-YYYY-XXXXXX) │
│  - Real-Time WebSocket Alerts (Socket.IO)                │
│  - Document Management & CMS Operations                  │
│  - Audit Logging & Admin Analytics Services              │
└────────────────────────────┬─────────────────────────────┘
                             │
                             │ Mongoose ODM Driver
                             v
┌──────────────────────────────────────────────────────────┐
│                    MONGODB ATLAS                         │
│   (Document Store with Indexes & Schema Validation)      │
│                                                          │
│  - Products, Categories & Application Mappings           │
│  - Enquiries (Quotes, Dealers, Contacts, Careers)        │
│  - Investor Documents & Technical Catalogues             │
│  - User Accounts, Roles & Audit Trail                    │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Patterns

### 2.1 Backend Architecture (Controller-Service-Model Pattern)
- **Routes Layer (`src/routes`)**: Defines endpoint paths, HTTP verbs, and mounts middleware chains (auth, rate limiting, file upload, validation).
- **Validators Layer (`src/validators`)**: Validates request parameters and body fields before passing control to controllers.
- **Controllers Layer (`src/controllers`)**: Handles HTTP requests, extracts parameters, coordinates service execution, and returns structured JSON responses.
- **Services Layer (`src/services`)**: Enforces business logic, transactional operations, audit logging, real-time events, and email notifications.
- **Models Layer (`src/models`)**: Defines Mongoose schemas, field validations, hooks, and index configurations.

### 2.2 Frontend Architecture (Feature-Driven App Router)
- **App Router (`src/app`)**: Server Components by default for optimal SEO, SSG, and performance, with Client Components mounted for interactive state.
- **Features (`src/features`)**: Encapsulated domains (e.g., `quote-workflow`, `product-comparison`, `dealer-enquiry`, `document-center`).
- **Design System (`src/components/ui`)**: Atomic design tokens and styled primitive UI components (Buttons, Cards, Modals, Tables, Forms).
- **Lib & API Client (`src/lib`)**: Axios/Fetch API wrapper configured with interceptors, standard error handling, and type safety.

---

## 3. Data & Entity Model Blueprint

### Primary Collections:
1. **`users`**: Administrative accounts, roles (`Admin`, `Editor`), hashed passwords, credentials.
2. **`products`**: Steel pipes, tubes, coils, scaffolding, billets, specifications, images, standards.
3. **`productCategories`**: Pipes & Tubes, Coils & Slit Sheets, Scaffolding Systems, Billets & Sponge Iron.
4. **`productApplications`**: Agriculture, Infrastructure, Construction, Power, General Engineering.
5. **`enquiries`**: Customer quotation requests with generated reference IDs (`HPIL-YYYY-XXXXXX`).
6. **`dealerEnquiries`**: B2B dealership & distribution requests.
7. **`contactMessages`**: General corporate inquiries and branch office routing.
8. **`jobApplications`**: Career applicant details, positions, resume attachments.
9. **`blogs`**: Industry insights, press releases, corporate news articles.
10. **`downloads`**: Technical datasheets, catalogues, certificates, investor reports.
11. **`facilities`**: Manufacturing units (Mahabubnagar, Ananthapur, Perundurai) and capacities.
12. **`homepageMetrics`**: Verified company key statistics (Capacities, Dealer counts, Milestones).
13. **`auditLogs`**: Logged administrative actions for auditability.
