export interface Item {
  _id: string;
  name: string;
  description?: string;
  category: string;
  mrp: number;
  unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateItemDto {
  name: string;
  description?: string;
  category: string;
  mrp: number;
  unit: string;
  is_active?: boolean;
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
  category?: string;
  mrp?: number;
  unit?: string;
  is_active?: boolean;
}

export interface GetItemsParams {
  category?: string;
  is_active?: boolean;
}