import { User } from './auth.types';

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
  type: 'main' | 'sub';
  location: string;
  contact_number: string;
  created_at: Date;
  updated_at: Date;
}

export interface SupplyItem {
  _id: string;
  supply_id: string;
  item_id: Item;
  quantity: number;
  unit_price: number;
  created_at: Date;
}

export interface Supply {
  _id: string;
  from_canteen_id: string | Canteen;
  to_canteen_id: string | Canteen;
  date: Date | string;
  created_by: string | User;
  created_at: Date | string;
  updated_at: Date | string;
  items?: SupplyItem[];
}