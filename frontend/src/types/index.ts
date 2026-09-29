export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  iconName?: string;
  productCount?: number;
}

export interface IQuoteRequestPayload {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  productId?: string;
  productName?: string;
  quantity?: string;
  requirementType: string;
  message: string;
}

export interface IDealerEnquiryPayload {
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
}

export interface IContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  message: string;
}

export interface IDownloadItem {
  _id: string;
  title: string;
  category: 'Brochure' | 'Product Catalogue' | 'Technical Datasheet' | 'Certificate' | 'Annual Report' | 'Financial Disclosure';
  financialYear?: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
