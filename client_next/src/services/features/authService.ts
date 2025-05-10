import { LoginRequest, LoginResponse, ApiResponse, User, RegisterRequest, RegisterResponse } from "@/src/types/auth.types";
import apiClient from "../api/apiClient";
import { handleApiError } from "../api/apiUtils";

export const authService = {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registration response
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>('/users/process-register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  /**
   * Log in a user with email and password
   * @param credentials User login credentials
   * @returns User data and access token
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
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
  },
  
  /**
   * Log out the current user
   * @returns void
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<{}>>('/auth/logout');
      
      // Clear the access token from localStorage
      localStorage.removeItem('access_token');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Get the current logged-in user data
   * @returns Current user data
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/current-user');
      return response.data.payload.user;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  /**
   * Check if a user is currently authenticated
   * @returns Boolean indicating authentication status
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  }
};
