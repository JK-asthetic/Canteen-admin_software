import apiClient from "./apiclient";  // Assuming apiClient is already set up as provided

// Types
export interface Category {
  _id: string;
  name: string;
}

export interface Unit {
  _id: string;
  name: string;
  abbreviation: string;
}

export interface Item {
  _id: string;
  name: string;
  description: string;
  category: Category;
  mrp: number;
  unit: Unit;
  is_active: boolean;
}

export interface Canteen {
  _id: string;
  name: string;
  location: string;
}

export interface Stock {
  _id: string;
  canteen_id: Canteen;
  item_id: Item;
  quantity: number;
  updated_at: string;
}

export interface StockHistory {
  _id: string;
  canteen_id: string;
  item_id: Item;
  date: string;
  opening_stock: number;
  closing_stock: number;
  received_stock: number;
  sold_stock: number;
}

// API Functions
export const getStockByCanteen = async (canteenId: string): Promise<Stock[]> => {
  try {
    return await apiClient.get(`/stocks/canteen/${canteenId}`)
    
  } catch (error) {
    console.error('Error fetching canteen stock:', error);
    throw error;
  }
};

export const updateStock = async (data: {
  canteen_id: string;
  item_id: string;
  quantity: number;
}): Promise<Stock> => {
  try {
    return await apiClient.put('/stocks', data);

  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const getStockHistory = async (
  canteenId: string,
  itemId?: string,
  days?: number
): Promise<StockHistory[]> => {
  try {
    let url = `/stocks/history/${canteenId}`;
    if (itemId) url += `/${itemId}`;
    if (days) url += `?days=${days}`;
    
    return await apiClient.get(url);
  } catch (error) {
    console.error('Error fetching stock history:', error);
    throw error;
  }
};