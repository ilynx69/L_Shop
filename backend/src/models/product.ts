export interface Product {
  id: string;               // или number, но string надёжнее для json
  name: string;
  description?: string;
  price: number;
  category: string;
  available: boolean;       // в наличии или нет
  stock?: number;           // опционально — количество на складе
  imageUrl?: string;        // опционально
  createdAt?: string;
  updatedAt?: string;
}

// Для создания нового товара (без id)
export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;