import { User, DeliveryFormData } from '../types';

// Имитация "сессии" в памяти фронтенда
let mockUser: User | null = null;

// Имитация сетевой задержки (чтобы было видно загрузку)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  checkAuth: async (): Promise<User | null> => {
    await delay(500);
    return mockUser;
  },
  
  login: async (data: Record<string, string>) => {
    await delay(800);
    // Для теста: введи логин admin и пароль 1234
    if (data.login === 'admin' && data.password === '1234') {
      mockUser = {
        id: '1',
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        login: 'admin',
        phone: '+375291112233'
      };
      return mockUser;
    }
    throw new Error('Неверный логин или пароль');
  },

  register: async (data: Record<string, string>) => {
    await delay(800);
    mockUser = {
      id: Math.random().toString(36).substring(7),
      name: data.name || 'Новый Пользователь',
      email: data.email,
      login: data.login,
      phone: data.phone || ''
    };
    return mockUser;
  },

  logout: async () => {
    await delay(500);
    mockUser = null;
  }
};

export const deliveryService = {
  submitOrder: async (data: DeliveryFormData) => {
    await delay(1000);
    console.log('Имитация отправки заказа на бэкенд:', data);
    return { success: true, orderId: 777 };
  },
  
  clearCart: async () => {
    await delay(300);
    console.log('Корзина успешно очищена');
    return { success: true };
  }
};