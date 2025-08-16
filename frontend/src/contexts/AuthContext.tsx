import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import type {
  User,
  LoginCredentials,
  SignupCredentials,
  AuthContextType,
} from '@/types/auth';

const defaultAuthContext: AuthContextType = {
  user: null,
  login: () => {
    throw new Error('AuthContext not initialized');
  },
  signup: () => {
    throw new Error('AuthContext not initialized');
  },
  logout: () => {
    throw new Error('AuthContext not initialized');
  },
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // load user/token from localStorage (very minimal persistence)
  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    const token = localStorage.getItem('token');
    if (saved !== null && token !== null) {
      try {
        const parsed = JSON.parse(saved) as User;
        setUser(parsed);
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(credentials);
      setUser(user);
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (error) {
      // Provide more specific error messages
      if (error instanceof Error) {
        throw new Error(error.message || 'Invalid email or password');
      }
      throw new Error('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.signup(credentials);
      setUser(user);
      localStorage.setItem('auth_user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (error) {
      // Provide more specific error messages
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to create account');
      }
      throw new Error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
