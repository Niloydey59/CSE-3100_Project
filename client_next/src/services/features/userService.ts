import { 
  UserResponse, 
  UsersResponse, 
  GetUsersParams, 
  UpdateUserParams,
  UpdatePasswordParams,
  ForgetPasswordParams,
  ResetPasswordParams,
  VerifyAccountParams
} from "@/src/types/user.types";
import apiClient from "../api/apiClient";
import { handleApiError } from "../api/apiUtils";

/**
 * Get users with optional pagination and search
 * @param params Query parameters for fetching users
 * @returns Users and pagination data
 */
export const getUsers = async (params?: GetUsersParams): Promise<UsersResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<UsersResponse>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get a specific user by ID
 * @param userId The ID of the user to fetch
 * @returns User data
 */
export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param userId The ID of the user to delete
 * @returns Success message
 */
export const deleteUserById = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Send verification email to user
 * @returns Success message and token
 */
export const sendVerificationEmail = async () => {
  try {
    const response = await apiClient.post('/users/send-verification-email');
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Activate user account with token
 * @param params Token for account activation
 * @returns Success message
 */
export const verifyAccount = async (params: VerifyAccountParams) => {
  try {
    const response = await apiClient.post('/users/verify', params);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Update user information
 * @param userId The ID of the user to update
 * @param params User data to update (can include username, bio, series, position, department)
 * @returns Updated user data
 */
export const updateUser = async (userId: string, params: UpdateUserParams): Promise<UserResponse> => {
  try {
    const response = await apiClient.put(`/users/${userId}`, params);
    return response.data;
  } catch (error) {
    // Add more specific error handling for this endpoint
    console.error("Error in updateUser:", error);
    handleApiError(error);
    throw error;
  }
};

/**
 * Update user password
 * @param userId The ID of the user
 * @param params Password data including old and new password
 * @returns Success message
 */
export const updatePassword = async (userId: string, params: UpdatePasswordParams) => {
  try {
    const response = await apiClient.put(`/users/update-password/${userId}`, params);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Initiate password reset process
 * @param params User email
 * @returns Success message and token
 */
export const forgetPassword = async (params: ForgetPasswordParams) => {
  try {
    const response = await apiClient.post('/users/forget-password', params);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param params Token and new password
 * @returns Success message and updated user data
 */
export const resetPassword = async (params: ResetPasswordParams) => {
  try {
    const response = await apiClient.put('/users/reset-password', params);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
