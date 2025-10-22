export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'manager';
  canteen_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthError {
  error: string;
}

