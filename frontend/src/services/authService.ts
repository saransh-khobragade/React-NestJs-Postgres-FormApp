import { api } from './api';
import type { LoginCredentials, SignupCredentials, User } from '@/types/auth';

interface ApiUser {
  id: number;
  name: string;
  email: string;
  age?: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface AuthResponse<T> extends ApiResponse<T> {
  access_token?: string;
}

// Convert API user format to frontend user format
const convertApiUser = (apiUser: ApiUser): User => ({
  id: String(apiUser.id),
  name: apiUser.name,
  email: apiUser.email,
  ...(apiUser.age !== undefined && { age: apiUser.age }),
  createdAt: apiUser.created_at,
  updatedAt: apiUser.updated_at,
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post<AuthResponse<ApiUser>>('/api/auth/login', credentials);
      
      if (!response.success) {
        throw new Error(response.message ?? 'Invalid email or password');
      }
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      const user = convertApiUser(response.data);
      const token = response.access_token ?? '';
      if (!token) throw new Error('Missing access token');
      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  signup: async (credentials: SignupCredentials): Promise<{ user: User; token: string }> => {
    try {
      const response = await api.post<AuthResponse<ApiUser>>('/api/auth/signup', {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        age: credentials.age,
      });
      
      if (!response.success) {
        throw new Error(response.message ?? 'Failed to create account');
      }
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      const user = convertApiUser(response.data);
      const token = response.access_token ?? '';
      if (!token) throw new Error('Missing access token');
      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Signup failed. Please try again.');
    }
  },
}; 