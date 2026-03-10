export interface User {
    id: string;           // UUID
    email: string;
    password: string;     // хеш пароля
    createdAt: string;    // ISO дата
}