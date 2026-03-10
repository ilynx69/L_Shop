import { getState, setState } from '../services/state.js';
import { authApi } from '../services/api.js';
import { router } from '../router.js';

export default class AuthPage {
    private container: HTMLElement;
    private isLoginMode: boolean = true;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    private handleRegister = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const userData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            login: formData.get('login') as string,
            phone: formData.get('phone') as string,
            password: formData.get('password') as string,
        };
        try {
            const result = await authApi.register(userData);
            setState({ isAuthenticated: true, user: result.user });
            router.navigateTo('/');
        } catch (error) {
            alert('Ошибка регистрации');
        }
    };

    private handleLogin = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const login = formData.get('login') as string;
        const password = formData.get('password') as string;
        try {
            const result = await authApi.login(login, password);
            setState({ isAuthenticated: true, user: result.user });
            router.navigateTo('/');
        } catch (error) {
            alert('Ошибка входа');
        }
    };

    render() {
        this.container.innerHTML = '';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = this.isLoginMode ? 'Перейти к регистрации' : 'Перейти ко входу';
        toggleBtn.addEventListener('click', () => {
            this.isLoginMode = !this.isLoginMode;
            this.render();
        });
        this.container.appendChild(toggleBtn);

        if (this.isLoginMode) {
            const form = document.createElement('form');
            form.innerHTML = `
                <h2>Вход</h2>
                <input type="text" name="login" placeholder="Логин или email" required>
                <input type="password" name="password" placeholder="Пароль" required>
                <button type="submit">Войти</button>
            `;
            form.addEventListener('submit', this.handleLogin);
            this.container.appendChild(form);
        } else {
            const form = document.createElement('form');
            form.setAttribute('data-registration', '');
            form.innerHTML = `
                <h2>Регистрация</h2>
                <input type="text" name="name" placeholder="Имя" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="text" name="login" placeholder="Логин" required>
                <input type="tel" name="phone" placeholder="Телефон" required>
                <input type="password" name="password" placeholder="Пароль" required>
                <button type="submit">Зарегистрироваться</button>
            `;
            form.addEventListener('submit', this.handleRegister);
            this.container.appendChild(form);
        }
    }
}