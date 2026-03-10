export interface Delivery {
    id: string;                // UUID
    userId: string;            // ID пользователя
    address: string;
    phone: string;
    email: string;
    paymentMethod: string;     // 'card' | 'cash' | 'online'
    createdAt: string;         // ISO дата
}