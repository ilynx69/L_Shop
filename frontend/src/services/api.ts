import { Product, ProductQueryParams, Cart, User, Delivery } from '../types/index.js';

// Константы портов и путей
const API_BASE = 'http://localhost:3002/api';
const AUTH_API = 'http://localhost:3001/api/auth';
const DELIVERY_API = 'http://localhost:3001/api/delivery'; // Базовый путь для ОДНОЙ доставки

// Вспомогательная функция для обработки JSON без any
async function handleResponse<T>(res: Response, errorMessage: string): Promise<T> {
    if (!res.ok) {
        const details = await res.text().catch(() => '');
        console.error(`[API Error] ${res.status}: ${errorMessage}`, details);
        throw new Error(errorMessage);
    }
    const data: unknown = await res.json();
    return data as T;
}

// ========== Товары ==========
export const productsApi = {
    async getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
        const url = new URL(`${API_BASE}/products`);
        if (params.q) url.searchParams.append('q', params.q);
        if (params.sort) url.searchParams.append('sort', params.sort);
        if (params.category) url.searchParams.append('category', params.category);
        if (params.available !== undefined) url.searchParams.append('available', String(params.available));
        
        const res = await fetch(url.toString(), { credentials: 'include' });
        return handleResponse<Product[]>(res, 'Ошибка загрузки товаров');
    },

    async getCategories(): Promise<string[]> {
        const res = await fetch(`${API_BASE}/categories`, { credentials: 'include' });
        return handleResponse<string[]>(res, 'Ошибка загрузки категорий');
    }
};

// ========== Корзина ==========
export const cartApi = {
    async getCart(): Promise<Cart> {
        const res = await fetch(`${API_BASE}/cart`, { credentials: 'include' });
        return handleResponse<Cart>(res, 'Ошибка загрузки корзины');
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
    },

    async clearCart(): Promise<void> {
        const res = await fetch(`${API_BASE}/cart`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Ошибка очистки корзины');
    }
};

// ========== Авторизация ==========
export const authApi = {
    async register(userData: { name: string; email: string; login: string; phone: string; password: string }): Promise<{ user: User }> {
        const res = await fetch(`${AUTH_API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        return handleResponse<{ user: User }>(res, 'Ошибка регистрации');
    },

    async login(login: string, password: string): Promise<{ user: User }> {
        const res = await fetch(`${AUTH_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ login, password })
        });
        return handleResponse<{ user: User }>(res, 'Ошибка входа');
    },

    async logout(): Promise<void> {
        const res = await fetch(`${AUTH_API}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Ошибка выхода');
    },

    async getMe(): Promise<{ user: User }> {
        const res = await fetch(`${AUTH_API}/me`, { credentials: 'include' });
        return handleResponse<{ user: User }>(res, 'Ошибка получения пользователя');
    }
};

// ========== Доставка (Проблема была тут) ==========
export const deliveryApi = {
    async create(data: { address: string; phone: string; email: string; paymentMethod: string }): Promise<{ delivery: Delivery }> {
        const res = await fetch(`${DELIVERY_API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        return handleResponse<{ delivery: Delivery }>(res, 'Ошибка оформления доставки');
    },

    async getUserDeliveries(): Promise<Delivery[]> {
        // ВНИМАНИЕ: Я заменил логику на прямой путь. 
        // Большинство серверов на Node.js используют множественное число: /api/deliveries
        const url = 'http://localhost:3001/api/deliveries'; 
        
        console.log(`[API] Запрос доставок на: ${url}`);

        const res = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });

        return handleResponse<Delivery[]>(res, 'Ошибка загрузки списка доставок');
    },

    async cancelDelivery(id: string): Promise<void> {
        const res = await fetch(`${DELIVERY_API}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Ошибка отмены доставки');
    }
};