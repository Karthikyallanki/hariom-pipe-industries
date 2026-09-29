# Hariom Pipe Industries Limited — Enterprise Production Deployment Guide

## 1. Overview & Architecture Blueprint
This document specifies the step-by-step production deployment strategy for the Hariom Pipe Industries Limited web platform (NSE: HARIOMPIPE | BSE: 543517).

- **Frontend Application**: Next.js (App Router, Turbopack, Tailwind CSS, TypeScript) hosted on **Vercel Edge Network**.
- **Backend API Application**: Node.js & Express.js REST API with Socket.IO hosted on **Vercel Serverless / AWS Elastic Beanstalk / Render**.
- **Database Layer**: **MongoDB Atlas Cluster** (Multi-region replica set with automated backups).

---

## 2. Environment Variables Configuration

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SITE_URL=https://www.hariompipes.com
NEXT_PUBLIC_API_URL=https://api.hariompipes.com/api
NEXT_PUBLIC_SOCKET_URL=https://api.hariompipes.com
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.mongodb.net/hariom_pipes?retryWrites=true&w=majority
JWT_SECRET=super_secret_enterprise_jwt_token_2026_prod
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_SITE_URL=https://www.hariompipes.com

EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=<sendgrid_api_key>
EMAIL_FROM=Hariom Pipes Sales Desk <sales@hariompipes.com>
```

---

## 3. Database Deployment (MongoDB Atlas Setup)
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Dedicated Cluster (M10+ recommended for enterprise SLA) in Mumbai region (`ap-south-1`).
3. Under **Database Access**, create a database user with `readWrite` permissions on `hariom_pipes`.
4. Under **Network Access**, whitelist Vercel deployment IP ranges or `0.0.0.0/0` (with password authentication enforced).
5. Obtain connection string URI and set `MONGODB_URI` environment variable.

---

## 4. Backend API Deployment
1. Build TypeScript code:
   ```bash
   npm run build --prefix backend
   ```
2. Verify build artifacts in `backend/dist`.
3. Deploy to production environment (Vercel Serverless or Render/AWS):
   - Set environment variables in target hosting dashboard.
   - Execute database seeder script to populate product catalog:
     ```bash
     curl -X POST https://api.hariompipes.com/api/products/seed-default
     curl -X POST https://api.hariompipes.com/api/admin/setup-default
     ```

---

## 5. Frontend Next.js Deployment (Vercel)
1. Push repository to GitHub/GitLab.
2. Import repository in [Vercel Dashboard](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`).
5. Click **Deploy**. Vercel will run `next build` and optimize static pages (`/sitemap.xml`, `/robots.txt`).

---

## 6. Custom Domain & SSL/TLS Setup
1. Configure DNS CNAME and A records at registrar (Cloudflare / GoDaddy):
   - `www.hariompipes.com` -> `cname.vercel-dns.com`
   - `api.hariompipes.com` -> Backend load balancer CNAME
2. Verify SSL/TLS auto-renewal certificate issuance.

---

## 7. Post-Deployment Automated Verification
Run automated API integration tests against the live endpoint:
```bash
npm run test:api --prefix backend
```
Verify 200 OK response from `https://www.hariompipes.com/sitemap.xml` and `https://api.hariompipes.com/api/health`.
