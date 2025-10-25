import { CreateUnitDto, GetUnitsParams, UpdateUnitDto, Unit } from '@/types/unit.types';
import apiClient from './apiclient';

export const createUnit = async (data: CreateUnitDto): Promise<Unit> => {
  return await apiClient.post('/units', data);
};

export const getUnits = async (params?: GetUnitsParams): Promise<Unit[]> => {
  return await apiClient.get('/units', { params });
};

export const getUnitById = async (id: string): Promise<Unit> => {
  return await apiClient.get(`/units/${id}`);
};

export const updateUnit = async (id: string, data: UpdateUnitDto): Promise<Unit> => {
  return await apiClient.put(`/units/${id}`, data);
};

export const deleteUnit = async (id: string): Promise<{ message: string }> => {
  return await apiClient.delete(`/units/${id}`);
};
