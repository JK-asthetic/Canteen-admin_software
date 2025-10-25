export interface Category {
  _id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  is_active?: boolean;
}

export interface GetCategoriesParams {
  is_active?: boolean;
}