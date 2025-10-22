import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from localStorage (client-side only)
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userToken');
  }
  return null;
};

// Helper function to remove token from localStorage (client-side only)
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userToken');
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Response Success:', response.status);
    return response.data;
  },
  async (error: AxiosError) => {
    console.error('🔴 Response Error:', {
      status: error.response?.status,
      message: error.message,
      code: error.code,
    });
    
    const { response } = error;
    
    // Handle unauthorized errors
    if (response && response.status === 401) {
      removeToken();
      // Optional: Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(
      response?.data || { error: 'An unexpected error occurred' }
    );
  }
);

export default apiClient;