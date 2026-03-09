export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
    image?: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
}

export interface Cart {
    userId: string;
    items: CartItem[];
}

export interface ProductQueryParams {
    q?: string;
    sort?: 'price_asc' | 'price_desc';
    category?: string;
    available?: boolean;
}