# Database Design & Schema Specification — Hariom Pipe Industries

## 1. Database Overview
The application utilizes **MongoDB Atlas** with Mongoose ODM in TypeScript.

All schemas enforce:
- `timestamps: true` (creating `createdAt` and `updatedAt`).
- Strict typing and validation rules.
- Text & compound indexes for fast search and aggregation.

---

## 2. Core Collections & Indexes

### 2.1 Products (`products`)
```typescript
interface IProduct {
  name: string;
  slug: string;
  category: ObjectId; // Ref: ProductCategory
  brand: string; // e.g., 'Hariom Pipes'
  shortDescription: string;
  description: string;
  applications: string[];
  specifications: Array<{
    name: string;
    value: string;
  }>;
  availableSizes: string[];
  standards: string[];
  finishes: string[];
  images: string[];
  featured: boolean;
  isPublished: boolean;
  viewsCount: number;
}
```
**Indexes**:
- `{ slug: 1 }` (Unique)
- `{ category: 1, isPublished: 1 }`
- `{ name: "text", description: "text", applications: "text" }` (Text search index)

### 2.2 Enquiries (`enquiries`)
```typescript
interface IEnquiry {
  enquiryId: string; // Ref format: HPIL-2026-XXXXXX
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  productId?: ObjectId;
  quantity?: string;
  requirementType: string;
  message: string;
  attachmentUrl?: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Qualified' | 'Closed' | 'Rejected';
  assignedTo?: ObjectId;
  notes: Array<{
    author: string;
    text: string;
    createdAt: Date;
  }>;
}
```
**Indexes**:
- `{ enquiryId: 1 }` (Unique)
- `{ status: 1, createdAt: -1 }`
- `{ email: 1 }`

### 2.3 Dealer Enquiries (`dealerEnquiries`)
```typescript
interface IDealerEnquiry {
  enquiryId: string; // Ref format: DLR-2026-XXXXXX
  name: string;
  companyName: string;
  phone: string;
  email: string;
  state: string;
  city: string;
  businessType: string;
  productInterest: string[];
  existingBusinessDetails: string;
  message: string;
  status: 'New' | 'Under Review' | 'Contacted' | 'Approved' | 'Rejected';
}
```

### 2.4 Downloads & Investor Documents (`downloads`)
```typescript
interface IDownload {
  title: string;
  category: 'Brochure' | 'Product Catalogue' | 'Technical Datasheet' | 'Certificate' | 'Annual Report' | 'Financial Disclosure';
  financialYear?: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  isPublic: boolean;
}
```
