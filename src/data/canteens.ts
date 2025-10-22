import { Canteen } from '@/lib/types';

export const canteens: Canteen[] = [
  {
    id: '1',
    name: 'Main Campus Canteen',
    location: 'Building A - Ground Floor',
    manager: 'John Doe',
    totalItems: 45,
    lowStockItems: 3,
    todaySales: 15420
  },
  {
    id: '2',
    name: 'Engineering Block Canteen',
    location: 'Building B - 1st Floor',
    manager: 'Jane Smith',
    totalItems: 38,
    lowStockItems: 5,
    todaySales: 12300
  },
  {
    id: '3',
    name: 'Hostel Canteen',
    location: 'Hostel Block - Ground Floor',
    manager: 'Mike Johnson',
    totalItems: 52,
    lowStockItems: 2,
    todaySales: 18650
  }
];