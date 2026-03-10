import { Product } from './product';     // ← подправь путь, если нужно

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface CartWithProducts {
  userId: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  total: number;          // итоговая сумма (можно считать на бэке или фронте)
}