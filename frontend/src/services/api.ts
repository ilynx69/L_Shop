import { Product, ProductQueryParams, Cart } from '../types/index.js';

const API_BASE = 'http://localhost:3002/api';

export const productsApi = {
    async getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
        const url = new URL(`${API_BASE}/products`);
        if (params.q) url.searchParams.append('q', params.q);
        if (params.sort) url.searchParams.append('sort', params.sort);
        if (params.category) url.searchParams.append('category', params.category);
        if (params.available !== undefined) url.searchParams.append('available', String(params.available));

        const res = await fetch(url.toString(), { credentials: 'include' });
        if (!res.ok) throw new Error('Ошибка загрузки товаров');
        return res.json();
    },

    async getCategories(): Promise<string[]> {
        const res = await fetch(`${API_BASE}/categories`, { credentials: 'include' });
        if (!res.ok) throw new Error('Ошибка загрузки категорий');
        return res.json();
    }
};

export const cartApi = {
    async getCart(): Promise<Cart> {
        const res = await fetch(`${API_BASE}/cart`, { credentials: 'include' });
        if (!res.ok) throw new Error('Ошибка загрузки корзины');
        return res.json();
    },

    async addItem(productId: string, quantity: number): Promise<void> {
        const res = await fetch(`${API_BASE}/cart/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId, quantity })
        });
        if (!res.ok) throw new Error('Ошибка добавления товара');
    },

    async updateItem(productId: string, quantity: number): Promise<void> {
        const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ quantity })
        });
        if (!res.ok) throw new Error('Ошибка обновления товара');
    },

    async removeItem(productId: string): Promise<void> {
        const res = await fetch(`${API_BASE}/cart/items/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Ошибка удаления товара');
    }
};