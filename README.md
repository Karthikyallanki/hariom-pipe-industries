# Hariom Pipe Industries Limited — Enterprise Corporate Web Platform

[![NSE: HARIOMPIPE](https://img.shields.io/badge/NSE-HARIOMPIPE-0b192c?style=for-the-badge&logo=stock-market)](https://www.nseindia.com/get-quotes/equity?symbol=HARIOMPIPE)
[![BSE: 543517](https://img.shields.io/badge/BSE-543517-ff6500?style=for-the-badge)](https://www.bseindia.com/stock-share-price/hariom-pipe-industries-ltd/hariompipe/543517/)
[![Capacity: 7.01 Lakh MTPA](https://img.shields.io/badge/Capacity-7.01_Lakh_MTPA-1e3e62?style=for-the-badge)](https://www.hariompipes.com)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge)](https://www.hariompipes.com)

A state-of-the-art, enterprise-grade full-stack web platform built for **Hariom Pipe Industries Limited** (NSE: HARIOMPIPE | BSE: 543517), a premier integrated steel manufacturer operating 4 production plant units in South India with an aggregate annual capacity of **7,01,237 MTPA**.

---

## 🚀 Key Platform Features

### Customer-Facing Portal
- **Homepage (`/`)**: Hero section ("ENGINEERED FOR STRENGTH. BUILT FOR WHAT'S NEXT."), Live Production Capacity Tickers, Product Spectrum, Value Chain, Industries Served, and Dealer CTA.
- **Product Catalog (`/products` & `/products/[slug]`)**: Interactive catalog showcasing HR Pipes, CR Pipes, GI Pipes, GP Tubes, HRPO/CRCA Slit Coils, Scaffolding Systems & MS Billets with detailed BIS/ASTM engineering specifications.
- **Rule-Based Product Finder (`/product-finder`)**: Interactive tool enabling engineers and procurement managers to select application, steel category, surface finish, and BIS standard.
- **Side-by-Side Product Comparison Matrix (`/compare`)**: Compare up to 3 steel products side-by-side evaluating grades, thickness ranges, standards, and applications.
- **Interactive Quotation RFQ System (`/quote`)**: Dynamic quotation builder generating reference IDs (`HPIL-YYYY-XXXXXX`), email confirmations, and real-time Socket.IO alerts.
- **Dealer Partnership Application (`/dealer-enquiry`)**: Onboarding portal generating reference IDs (`DLR-YYYY-XXXXXX`) for distributor network expansion.
- **Manufacturing & Plant Capabilities (`/manufacturing`)**: Plant tours of Mahabubnagar (Telangana), Anantapur (Andhra Pradesh), Perundurai (Tamil Nadu), and Hyderabad units with 6-step manufacturing process breakdown.
- **Corporate Governance & ESG (`/about`, `/quality`, `/esg`)**: Company history (1962–2024), vision, mission, quality standards (IS 1161, IS 1239, IS 4923, IS 2830), 5-stage QC protocol, hot charging, bio-gas utilization, and water recycling.
- **Investor & Technical Document Centre (`/investors` & `/downloads`)**: Real-time stock ticker portal (`NSE: HARIOMPIPE | BSE: 543517`), financial disclosures, annual reports, and technical datasheets repository with download counters.
- **Global Multi-Model Search (`/search`)**: Real-time text search across products, whitepapers, investor filings, and manufacturing plant facilities.

### Administrator Operations Hub
- **Admin Authentication Portal (`/admin/login`)**: Protected corporate authentication with JWT storage and brute-force rate-limiting.
- **Operations Dashboard (`/admin/dashboard`)**: Live KPI metrics (total RFQs, dealer applications, active products), recent quote tables, and pipeline status charts.
- **Product Catalog Manager (`/admin/products`)**: Full CRUD operations for product specifications, standards, finishes, and publish/draft toggles.
- **Enquiry & Pipeline Operations (`/admin/enquiries`)**: Inspection drawer for customer RFQs and dealer applications, status stage updating (`New`, `In Progress`, `Qualified`, `Closed`), and internal sales notes logging.
- **Platform Analytics Engine (`/admin/analytics`)**: MongoDB aggregation pipelines tracking top-viewed products, regional RFQ demand heatmaps (state-wise density), and document downloads.
- **Real-Time Notification Center (`AdminNotificationCenter`)**: Socket.IO client widget with unread notification badge, audio chime alert, and real-time event updates.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Socket.IO Client.
- **Backend API**: Node.js, Express.js, Mongoose (MongoDB Atlas), Socket.IO Server, JWT, BcryptJS, Helmet, Express Rate Limit.
- **Testing**: Supertest & TypeScript automated API test suite (`npm run test:api`).
- **SEO & Accessibility**: Next.js native `sitemap.ts`, `robots.ts`, OpenGraph, Schema.org `Corporation` JSON-LD, WCAG 2.1 AA `:focus-visible` compliance.

---

## 📁 Monorepo Folder Structure

```
Hariom industries/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & MongoDB Atlas connection
│   │   ├── controllers/     # Express API controllers (Auth, Products, Enquiries, Analytics)
│   │   ├── middleware/      # Auth, RateLimiter, ErrorHandler, AsyncHandler
│   │   ├── models/          # 11 Mongoose Schemas (Product, Enquiry, Dealer, User, etc.)
│   │   ├── routes/          # Express Routers
│   │   ├── scripts/         # Automated API Test Suite (testApi.ts)
│   │   ├── services/        # Email service & Audit service
│   │   ├── server.ts        # Express & Socket.IO HTTP Server
│   │   └── app.ts           # Helmet, CORS & Express middleware
│   ├── vercel.json          # Serverless deployment configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # 27 App Router pages (public + admin portals + sitemap + robots)
│   │   ├── components/      # UI Primitives & Layout Navbar/Footer & Notification Center
│   │   ├── lib/             # API Client & Socket.IO singleton
│   │   └── types/           # TypeScript interfaces
│   ├── vercel.json          # Frontend Vercel deployment configuration
│   └── package.json
├── docs/
│   ├── architecture.md      # System Architecture Blueprint
│   ├── database.md          # Database Schemas & Indexing Specification
│   ├── api.md               # REST API Endpoint Documentation
│   ├── deployment.md        # Production Vercel & MongoDB Atlas Deployment Guide
│   └── code_audit.md        # Code Quality & Compliance Report
└── README.md                # Project Handover Master Guide
```

---

## ⚙️ Quick Start Guide

### 1. Installation & Environment Setup
Clone repository and install dependencies for both frontend and backend:
```bash
cd "d:\Hariom industries"
npm install --prefix backend
npm install --prefix frontend
```

### 2. Seed Default Database & Admin
Start backend server and seed default product catalog and default admin credentials (`admin@hariompipes.com` / `HariomAdmin2026!Secure`):
```bash
npm run dev --prefix backend
```

### 3. Run Automated Integration Test Suite
Execute the 18-point automated API test suite:
```bash
npm run test:api --prefix backend
```

### 4. Run Frontend Next.js Dev Server
```bash
npm run dev --prefix frontend
```
Navigate to `http://localhost:3000` to access the corporate site, and `http://localhost:3000/admin/login` for the admin portal.

### 5. Production Build Verification
```bash
npm run build --prefix backend
npm run build --prefix frontend
```

---

## ⚖️ Corporate Ownership & License
© 2026 **Hariom Pipe Industries Limited**. All Rights Reserved.  
Registered Corporate Office: 3-6-290/16, 1st Floor, Himayatnagar, Hyderabad - 500029, Telangana, India.
