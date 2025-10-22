import apiClient from './apiclient';
import { LoginResponse, User } from '../types/auth.types';

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  return await apiClient.post('/auth/login', { username, password });
};

export const logout = async (): Promise<void> => {
  return await apiClient.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  return await apiClient.get('/auth/me');
};