import apiClient from './apiclient';
import { Supply } from '@/types/supply.types';
import { getServerStartOfDay } from '@/utils/serverTime';

export const getSuppliesByCanteenId = async (canteenId: string): Promise<Supply[]> => {
  try {
    return await apiClient.get(`/supplies/to/${canteenId}`);
  } catch (error) {
    console.error('Error fetching supplies by canteen ID:', error);
    throw error;
  }
};

export const getTodaySupply = async (canteenId: string): Promise<Supply | null> => {
  try {
    const response: Supply[] = await apiClient.get(`/supplies/to/${canteenId}`);
    
    // Get today's date from server time with time set to 00:00:00
    const todayStart = await getServerStartOfDay();
    // Find today's supply if it exists
    const todaySupply = response.find((supply: Supply) => {
      const supplyDate = new Date(supply.date);
      supplyDate.setHours(0, 0, 0, 0);
      return supplyDate.getTime() === todayStart.getTime();
    });
    
    return todaySupply || null;
  } catch (error) {
    console.error('Error fetching today\'s supply:', error);
    throw error;
  }
};

export const getSupplyById = async (supplyId: string): Promise<Supply> => {
  try {
    return await apiClient.get(`/supplies/${supplyId}`);
  } catch (error) {
    console.error('Error fetching supply by ID:', error);
    throw error;
  }
};