import { CreateItemDto, GetItemsParams, UpdateItemDto, Item } from '@/types/Item.types';
import apiClient from './apiclient';

// API Functions
export const createItem = async (data: CreateItemDto): Promise<Item> => {
  return await apiClient.post('/items', data);
};

export const getItems = async (params?: GetItemsParams): Promise<Item[]> => {
  return await apiClient.get('/items', { params });
};

export const getItemById = async (id: string): Promise<Item> => {
  return await apiClient.get(`/items/${id}`);
};

export const updateItem = async (id: string, data: UpdateItemDto): Promise<Item> => {
  return await apiClient.put(`/items/${id}`, data);
};

export const deleteItem = async (id: string): Promise<{ message: string }> => {
  return await apiClient.delete(`/items/${id}`);
};