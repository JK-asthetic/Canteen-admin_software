import apiClient from './apiclient';
import { Canteen, CreateCanteenDto, UpdateCanteenDto, LockCanteenDto } from '../types/canteen.types';

export const createCanteen = async (data: CreateCanteenDto): Promise<Canteen> => {
  return await apiClient.post('/canteens', data);
};

export const getCanteens = async (params?: { type?: 'main' | 'sub', include_locked?: boolean }): Promise<Canteen[]> => {
  return await apiClient.get('/canteens', { params });
};

export const getCanteenById = async (id: string): Promise<Canteen> => {
  return await apiClient.get(`/canteens/${id}`);
};

export const updateCanteen = async (id: string, data: UpdateCanteenDto): Promise<Canteen> => {
  return await apiClient.put(`/canteens/${id}`, data);
};

export const deleteCanteen = async (id: string): Promise<void> => {
  return await apiClient.delete(`/canteens/${id}`);
};

export const lockCanteen = async (id: string, data: LockCanteenDto): Promise<Canteen> => {
  return await apiClient.post(`/canteens/${id}/lock`, data);
};

export const unlockCanteen = async (id: string): Promise<Canteen> => {
  return await apiClient.post(`/canteens/${id}/unlock`);
};

export const getLockedCanteens = async (): Promise<Canteen[]> => {
  return await apiClient.get('/canteens-locked');
};

export const autoUnlockCanteens = async (): Promise<{ message: string; unlockedCount: number }> => {
  return await apiClient.post('/canteens/auto-unlock');
};
