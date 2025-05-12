import { create } from 'zustand';
import { User } from '@/src/types/user.types';
import { 
  login as apiLogin, 
  logout as apiLogout, 
  register as apiRegister, 
  getCurrentUser as apiGetCurrentUser,
  isAuthenticated as apiIsAuthenticated
} from '@/src/services/features/authService';
import { LoginRequest, RegisterRequest } from '@/src/types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearError: () => void;
  resetRegistrationSuccess: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: apiIsAuthenticated(),
  isLoading: false,
  error: null,
  registrationSuccess: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiLogin({ email, password });
      set({ 
        user: response.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  },
  
  logout: async () => {
    set({ isLoading: true });
    try {
      await apiLogout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      });
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiRegister({ username, email, password });
      set({ 
        isLoading: false,
        registrationSuccess: true 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      });
      throw error;
    }
  },
  
  fetchCurrentUser: async () => {
    if (!get().isAuthenticated) return;
    
    set({ isLoading: true });
    try {
      const user = await apiGetCurrentUser();
      set({ user, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user data',
        user: null,
        isAuthenticated: false
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
  
  resetRegistrationSuccess: () => {
    set({ registrationSuccess: false });
  }
}));
