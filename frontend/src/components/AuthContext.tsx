import React, { createContext, useContext, useState, ReactNode } from 'react';

// Описываем структуру пользователя согласно ТЗ (email/логин) [cite: 47]
interface User {
  email: string;
  name?: string;
}

// Описываем, что именно будет доступно в нашем контексте
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Функция входа
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Здесь в будущем будет fetch запрос к твоему Express серверу 
      // Пока делаем имитацию успешного входа
      console.log('Попытка входа:', email);
      
      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setUser({ email, name: 'Студент' });
      
      // Согласно ТЗ, после входа пользователь считается зарегистрированным 
      // и может видеть корзину/доставку.
    } catch (error) {
      console.error('Ошибка авторизации', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для удобного использования контекста в компонентах
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};