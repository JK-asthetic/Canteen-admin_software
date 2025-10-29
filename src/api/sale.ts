import apiClient from './apiclient';
import { formatDate } from '@/app/utils/formatters';
import { Unit } from './stock';
import { getUnits } from './unit';

// Types
// In @/api/sale.ts
export interface SaleItem {
  item_id: {
    _id: string;
    name: string;
    unit: Unit; // Change from `string` to full Unit
    category?: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Sale {
  _id: string;
  canteen_id: string;
  date: string;
  total_amount: number;
  cash_amount: number;
  online_amount: number;
  items: SaleItem[];
  created_at?: string;
  updated_at?: string;
  created_by?: {
    _id: string;
    name: string;
    username: string;
  };
}

export interface SalesSummaryByDate {
  date: string;
  total_amount: number;
  cash_amount: number;
  online_amount: number;
  sales_count: number;
  total_items: number;
}
// Add this new function to your sales API file
export const getSalesInCreatedAtRange = async (
  startIso: string,
  endIso: string,
  canteenId?: string
): Promise<Sale[]> => {
  const params: any = {
    created_at_gte: startIso,
    created_at_lte: endIso,
  };

  if (canteenId) {
    params.canteen_id = canteenId;
  }

  const response = await apiClient.get('/sales', { params });
  const sales: Sale[] = response.data || response; // adjust based on your apiClient

  // Resolve unit objects if only ID is provided
  const units = await getUnits();
  const unitMap = new Map(units.map(u => [u._id, u]));

  sales.forEach(sale => {
    sale.items.forEach(item => {
      const unitId = typeof item.item_id.unit === 'string' ? item.item_id.unit : item.item_id.unit?._id;
      if (unitId && !item.item_id.unit?._id) {
        item.item_id.unit = unitMap.get(unitId) || { _id: unitId, name: 'Unknown', abbreviation: '?' };
      }
    });
  });

  return sales;
};

// Get sales for a specific canteen and date
export const getSalesByDateAndCanteen = async (date: Date, canteen_id: string): Promise<Sale[]> => {
  const dateStr = formatDate(date, 'YYYY-MM-DD');
  return await apiClient.get('/sales', {
    params: { date: dateStr, canteen_id }
  });
};

// Get sales by date (for all canteens or role-based)
export const getSalesByDate = async (date: Date): Promise<Sale[]> => {
  const dateStr = formatDate(date, 'YYYY-MM-DD');
  return await apiClient.get('/sales', {
    params: { date: dateStr }
  });
};

// Get sales by date range
export const getSalesByDateRange = async (
  startDate: string, 
  endDate: string, 
  canteenId?: string
): Promise<SalesSummaryByDate[]> => {
  const params: any = { 
    start_date: startDate, 
    end_date: endDate 
  };
  
  if (canteenId) {
    params.canteen_id = canteenId;
  }
  
  return await apiClient.get('/sales/date-range', { params });
};

// Get detailed sales for a canteen
export const getSalesByCanteen = async (canteenId: string): Promise<Sale[]> => {
  return await apiClient.get(`/sales/canteen/${canteenId}`);
};

// Get single sale by ID
export const getSaleById = async (saleId: string): Promise<Sale> => {
  return await apiClient.get(`/sales/${saleId}`);
};

// Create new sale
export const createSale = async (saleData: {
  canteen_id: string;
  items: Array<{
    item_id: string;
    quantity: number;
    unit_price: number;
  }>;
  cash_amount: number;
  online_amount: number;
}): Promise<Sale> => {
  return await apiClient.post('/sales', saleData);
};

// Update existing sale
export const updateSale = async (saleId: string, saleData: {
  items: Array<{
    item_id: string;
    quantity: number;
    unit_price: number;
  }>;
  cash_amount: number;
  online_amount: number;
}): Promise<Sale> => {
  return await apiClient.put(`/sales/${saleId}`, saleData);
};

// Delete sale
export const deleteSale = async (saleId: string): Promise<{ message: string }> => {
  return await apiClient.delete(`/sales/${saleId}`);
};