import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data);
    
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 }); 
    }
    
    return response.data as AuthResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

export const googleLogin = async (googleToken: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
      token: googleToken
    });
    
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 }); 
    }
    
    return response.data as AuthResponse;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Google login failed'
    };
  }
};

export const logout = () => {
  Cookies.remove('token');
  window.location.href = '/login';
};

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};