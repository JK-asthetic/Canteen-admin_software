import { CreateUserDto, GetUsersParams, UpdateUserDto, User } from '@/types/user.types';
import apiClient from './apiclient';

// API Functions
export const createUser = async (data: CreateUserDto): Promise<User> => {
  return await apiClient.post('/users', data);
};

export const getUsers = async (params?: GetUsersParams): Promise<User[]> => {
  return await apiClient.get('/users', { params });
};

export const getUserById = async (id: string): Promise<User> => {
  return await apiClient.get(`/users/${id}`);
};

export const updateUser = async (id: string, data: UpdateUserDto): Promise<User> => {
  return await apiClient.put(`/users/${id}`, data);
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  return await apiClient.delete(`/users/${id}`);
};