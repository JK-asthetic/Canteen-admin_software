export interface Unit {
  _id: string;
  name: string;
  abbreviation: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUnitDto {
  name: string;
  abbreviation: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateUnitDto {
  name?: string;
  abbreviation?: string;
  description?: string;
  is_active?: boolean;
}

export interface GetUnitsParams {
  is_active?: boolean;
}