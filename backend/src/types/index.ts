import { Request } from 'express';

export interface IUserPayload {
  userId: string;
  email: string;
  role: 'Admin' | 'Editor';
}

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
