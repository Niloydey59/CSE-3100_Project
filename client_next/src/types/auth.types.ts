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

export interface User {
  _id: string;
  email: string;
  username: string;
  bio?: string;
  series?: {
    value: number;
    pendingApproval: boolean;
    isApproved: boolean;
  };
  position?: {
    value: string;
    pendingApproval: boolean;
    isApproved: boolean;
  };
  department?: {
    value: string;
    pendingApproval: boolean;
    isApproved: boolean;
  };
  verificationDocument?: string[];
  groups?: string[];
  isVerified: boolean;
  isAdmin: boolean;
}

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
