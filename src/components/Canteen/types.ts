import { Canteen, CreateCanteenDto, UpdateCanteenDto } from '@/types/canteen.types';

export interface AddCanteenProps {
  onAdd: (canteen: CreateCanteenDto) => Promise<void>;
}

export interface EditCanteenProps {
  canteens: Canteen[];
  onEdit: (id: string, updates: UpdateCanteenDto) => Promise<void>;
}

export interface DeleteCanteenProps {
  canteens: Canteen[];
  onDelete: (id: string) => Promise<void>;
}