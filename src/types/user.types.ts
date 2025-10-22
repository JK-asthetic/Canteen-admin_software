// @/types/User.types.ts

export interface Canteen {
  _id: string;
  name: string;
  location: string;
  // Add other canteen fields as needed
}

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  canteen_id?: string | Canteen; // Can be either ID string or populated object
  created_at: string;
  updated_at: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  canteen_id?: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'manager';
  canteen_id?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'manager';
  canteen_id?: string;
}