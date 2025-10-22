export interface Canteen {
  id: string;
  name: string;
  location: string;
  manager: string;
  totalItems: number;
  lowStockItems: number;
  todaySales: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  canteenId?: string;
}

export interface Item {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  canteenId: string;
}
