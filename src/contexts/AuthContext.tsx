import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, LoginRequest, LoginResponse, ApiError } from '../services/api';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user && authApi.isAuthenticated();

  const checkAuth = () => {
    try {
      const userData = authApi.getUser();
      const token = authApi.getToken();
      
      if (userData && token) {
        setUser(userData);
      } else {
        setUser(null);
        authApi.clearAuthData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      authApi.clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    
    try {
      const response = await authApi.login(credentials);
      
      if (response.error) {
        throw new ApiError(response.message || 'Login failed', 400);
      }

      if (!response.token || !response.user_id) {
        throw new ApiError('Invalid response from server', 500);
      }

      // Store authentication data
      authApi.setAuthData(response);
      
      // Create user object from response
      const userData = {
        id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        role: response.role
      };
      
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${response.first_name}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        if (error.status === 401) {
          throw new Error('Invalid email or password');
        } else if (error.status === 400) {
          throw new Error('Email and password are required');
        } else {
          throw new Error(error.message || 'Login failed');
        }
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
