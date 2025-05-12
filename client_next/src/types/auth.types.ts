import { User } from './user.types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  payload: Record<string, unknown>;
}

// Removed duplicated User interface - now importing from user.types.ts

export interface LoginResponse {
  user: User;
  accessToken: string;
  userId: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  payload: T;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface VerificationRequest {
  series?: number;
  position?: string;
  department?: string;
}

export interface VerificationResponse {
  pendingVerifications: string[];
}

export interface UploadDocumentsResponse {
  documents: string[];
}

export interface ApproveVerificationRequest {
  userId: string;
  field: string;
  status: 'approve' | 'reject';
}

export interface Document {
  id: string;
  url: string;
  filename: string;
  uploadDate: string;
}
