import { CreateCategoryDto, GetCategoriesParams, UpdateCategoryDto, Category } from '@/types/category.types';
import apiClient from './apiclient';

export const createCategory = async (data: CreateCategoryDto): Promise<Category> => {
  return await apiClient.post('/categories', data);
};

export const getCategories = async (params?: GetCategoriesParams): Promise<Category[]> => {
  return await apiClient.get('/categories', { params });
};

export const getCategoryById = async (id: string): Promise<Category> => {
  return await apiClient.get(`/categories/${id}`);
};

export const updateCategory = async (id: string, data: UpdateCategoryDto): Promise<Category> => {
  return await apiClient.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id: string): Promise<{ message: string }> => {
  return await apiClient.delete(`/categories/${id}`);
};
