// Строгая типизация пользователя
export interface User {
  login: string;
  email: string;
  name?: string;
  phone?: string;
}

class AuthService {
  private user: User | null = null;

  async login(userData: User): Promise<void> {
    // Имитация запроса на бэкенд
    await new Promise(resolve => setTimeout(resolve, 500));
    this.user = userData;
    console.log('Успешный вход. Текущий юзер:', this.user);
  }

  logout(): void {
    this.user = null;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  getUser(): User | null {
    return this.user;
  }
}

// Экспортируем единственный экземпляр класса (Singleton)
export const authService = new AuthService();