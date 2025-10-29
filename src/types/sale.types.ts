import { Item } from "./Item.types";

export interface Sale {
  _id: string;
  date: string;
  total_amount: number;
  cash_amount: number;
  online_amount: number;
  items: Item[];
  // Add other fields as needed
}