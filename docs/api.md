# REST API Specification — Hariom Pipe Industries

## Base URL
`http://localhost:5000/api`

---

## Endpoint Matrix

### 1. Public API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/health` | Service health status | None |
| GET | `/api/products` | Query products with filters & pagination | None |
| GET | `/api/products/:slug` | Retrieve detailed product by slug | None |
| GET | `/api/categories` | Retrieve all product categories | None |
| GET | `/api/industries` | Retrieve industry solutions | None |
| GET | `/api/blogs` | Retrieve insights and blogs | None |
| GET | `/api/blogs/:slug` | Retrieve blog article detail | None |
| GET | `/api/downloads` | Query documents by category/year | None |
| GET | `/api/facilities` | Retrieve manufacturing units & capacities | None |
| POST | `/api/enquiries` | Submit product quote request | None |
| POST | `/api/dealer-enquiries` | Submit dealership application | None |
| POST | `/api/contact` | Submit general contact message | None |
| POST | `/api/job-applications` | Submit career application | None |

### 2. Admin API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/admin/login` | Authenticate admin user & issue JWT | None |
| GET | `/api/admin/me` | Get currently logged in admin user | JWT |
| GET | `/api/admin/enquiries` | List quote enquiries with pagination | JWT |
| PATCH | `/api/admin/enquiries/:id` | Update enquiry status and notes | JWT |
| GET | `/api/admin/dealer-enquiries` | List dealership applications | JWT |
| GET | `/api/admin/products` | List all products including drafts | JWT |
| POST | `/api/admin/products` | Create new product entity | JWT |
| PATCH | `/api/admin/products/:id` | Update existing product entity | JWT |
| DELETE | `/api/admin/products/:id` | Delete/archive product entity | JWT |
| GET | `/api/admin/analytics/overview` | Retrieve dashboard KPI analytics | JWT |

---

## Standard JSON Response Format

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address format"
  }
}
```
