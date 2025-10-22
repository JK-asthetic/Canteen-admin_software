export interface Canteen {
  _id: string;
  name: string;
  type: 'main' | 'sub';
  location: string;
  contact_number: string;
  is_locked: boolean;
  locked_at?: Date | null;
  locked_by?: string | null;
  lock_reason?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateCanteenDto {
  name: string;
  type: 'main' | 'sub';
  location: string;
  contact_number: string;
}

export interface UpdateCanteenDto {
  name?: string;
  type?: 'main' | 'sub';
  location?: string;
  contact_number?: string;
}

export interface LockCanteenDto {
  lock_reason: string;
}

export interface CanteenWithStats extends Canteen {
  totalItems?: number;
  todaySales?: number;
  lowStockItems?: number;
  manager?: string;
}