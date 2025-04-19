import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import api from '../services/api'; 

// Define user interface
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Define auth state interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Define context interface
interface AuthContextType extends AuthState {
  register: (firstName: string, lastName: string, email: string, password: string, companyName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (localStorage.getItem('token')) {
          // Get current user
          const response = await api.get('/me');
          
          setAuthState({
            isAuthenticated: true,
            user: response.data.data,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: 'Session expired. Please log in again.'
        });
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const response = await api.post('/auth/register', {
        firstName,
        lastName,
        email,
        password
      });
      
      setAuthState({
        isAuthenticated: false, // User needs to verify email first
        user: null,
        loading: false,
        error: null
      });

      return response.data;
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Registration failed'
      }));
      throw err;
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null
      });
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Invalid credentials'
      }));
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.get('/auth/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Logout failed'
      }));
    }
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await api.post('/auth/forgot-password', { email });
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to send reset email'
      }));
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const response = await api.put(`/auth/reset-password/${token}`, {
        password
      });
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null
      });
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Password reset failed'
      }));
      throw err;
    }
  };

  // Verify email
  const verifyEmail = async (token: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await api.get(`/auth/verify/${token}`);
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Email verification failed'
      }));
      throw err;
    }
  };

  // Update profile
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const response = await api.put('/auth/update-details', userData);
      
      setAuthState(prev => ({
        ...prev,
        user: response.data.data,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Profile update failed'
      }));
      throw err;
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await api.put('/auth/update-password', {
        currentPassword,
        newPassword
      });
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: null
      }));
    } catch (err: any) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Password update failed'
      }));
      throw err;
    }
  };

  // Clear error
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        verifyEmail,
        updateProfile,
        updatePassword,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};