"use client";
import { 
  LoginRequest, 
  LoginResponse, 
  ApiResponse, 
  RegisterRequest, 
  RegisterResponse, 
  RefreshTokenResponse,
  VerificationRequest,
  VerificationResponse,
  UploadDocumentsResponse,
  ApproveVerificationRequest
} from "@/src/types/auth.types";
import { User } from "@/src/types/user.types";
import apiClient from "../api/apiClient";
import { handleApiError } from "../api/apiUtils";

/**
 * Register a new user
 * @param userData User registration data
 * @returns Registration response
 */
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>('/users/process-register', userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Log in a user with email and password
 * @param credentials User login credentials
 * @returns User data and access token
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    
    // Store the access token in localStorage
    if (response.data.payload.accessToken) {
      localStorage.setItem('access_token', response.data.payload.accessToken);
    }

    if (response.data.payload.userId) {
      localStorage.setItem('userId', response.data.payload.userId);
    }
    
    return response.data.payload;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Log out the current user
 * @returns void
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.get<ApiResponse<{}>>('/auth/logout');
    
    // Clear the access token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get the current logged-in user data
 * @returns Current user data
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/current-user');
    return response.data.payload.user;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Refresh the access token using the refresh token cookie
 * @returns New access token
 */
export const refreshAccessToken = async (): Promise<string> => {
  try {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token');
    const newAccessToken = response.data.payload.accessToken;
    
    // Update the access token in localStorage
    localStorage.setItem('access_token', newAccessToken);
    
    return newAccessToken;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Request verification for user profile data (without documents)
 * @param verificationData Data to verify (series, position, department)
 * @returns Verification request response
 */
export const requestVerification = async (
  verificationData: VerificationRequest
): Promise<VerificationResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<VerificationResponse>>(
      `/auth/users/verify`,
      verificationData
    );
    
    return response.data.payload;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Upload verification documents
 * @param files Verification document files
 * @returns Document upload response
 */
export const uploadVerificationDocuments = async (
  files: File[]
): Promise<UploadDocumentsResponse> => {
  try {
    const formData = new FormData();
    
    // Add verification files
    files.forEach(file => {
      formData.append('verificationProof', file);
    });
    
    const response = await apiClient.post<ApiResponse<UploadDocumentsResponse>>(
      `/auth/users/upload-documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.payload;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Approve or reject a verification request (admin only)
 * @param approvalData Approval data including userId, field, and status
 * @returns Updated user data
 */
export const approveVerification = async (
  approvalData: ApproveVerificationRequest
): Promise<User> => {
  try {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      '/auth/users/approve-verification',
      approvalData
    );
    
    return response.data.payload.user;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Check if a user is currently authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = (): boolean => {

  console.log('Checking authentication status...');
  
   if (typeof window === 'undefined') {
    console.log('Running on server, no localStorage available');
    return false;
  }
  console.log('Running on client, checking localStorage');
  const accessToken = localStorage.getItem('access_token');
  // Check if the access token exists in localStorage
  if (!accessToken) {
    // If no access token, user is not authenticated
    console.log('No access token found. User is not authenticated.');
    return false;
  }
  else {
    console.log('Access token found. User is authenticated.');
    return true;
  }
};

