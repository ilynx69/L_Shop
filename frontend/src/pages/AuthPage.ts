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

        const wrapper = document.createElement('div');
        wrapper.style.maxWidth = '400px';
        wrapper.style.margin = '0 auto';
        wrapper.style.padding = '30px';
        wrapper.style.backgroundColor = 'white';
        wrapper.style.borderRadius = '15px';
        wrapper.style.boxShadow = '0 5px 15px rgba(0, 40, 0, 0.1)';
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden';

        // Зеленая полоска сверху
        const topBar = document.createElement('div');
        topBar.style.position = 'absolute';
        topBar.style.top = '0';
        topBar.style.left = '0';
        topBar.style.right = '0';
        topBar.style.height = '5px';
        topBar.style.background = 'linear-gradient(90deg, #1a3b2e, #c6a15b)';
        wrapper.appendChild(topBar);

        const title = document.createElement('h1');
        title.textContent = this.isLoginMode ? 'Вход' : 'Регистрация';
        title.style.color = '#1a3b2e';
        title.style.fontSize = '2rem';
        title.style.marginBottom = '30px';
        title.style.borderBottom = '3px solid #c6a15b';
        title.style.paddingBottom = '10px';
        title.style.display = 'inline-block';
        wrapper.appendChild(title);

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = this.isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти';
        toggleBtn.style.background = 'none';
        toggleBtn.style.border = 'none';
        toggleBtn.style.color = '#2a5a45';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.textDecoration = 'underline';
        toggleBtn.style.marginBottom = '20px';
        toggleBtn.style.display = 'block';
        toggleBtn.style.fontSize = '0.9rem';
        toggleBtn.addEventListener('click', () => {
            this.isLoginMode = !this.isLoginMode;
            this.render();
        });
        wrapper.appendChild(toggleBtn);

        if (this.isLoginMode) {
            const form = document.createElement('form');
            form.style.display = 'flex';
            form.style.flexDirection = 'column';
            form.style.gap = '15px';
            form.innerHTML = `
                <input type="text" name="login" placeholder="Логин или email" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <input type="password" name="password" placeholder="Пароль" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <button type="submit" 
                    style="background: linear-gradient(135deg, #2a5a45, #1a3b2e); color: white; border: none; padding: 12px; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    Войти
                </button>
            `;
            form.addEventListener('submit', this.handleLogin);
            wrapper.appendChild(form);
        } else {
            const form = document.createElement('form');
            form.setAttribute('data-registration', '');
            form.style.display = 'flex';
            form.style.flexDirection = 'column';
            form.style.gap = '15px';
            form.innerHTML = `
                <input type="text" name="name" placeholder="Имя" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <input type="email" name="email" placeholder="Email" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <input type="text" name="login" placeholder="Логин" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <input type="tel" name="phone" placeholder="Телефон" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <input type="password" name="password" placeholder="Пароль" required
                    style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
                <button type="submit"
                    style="background: linear-gradient(135deg, #2a5a45, #1a3b2e); color: white; border: none; padding: 12px; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                    Зарегистрироваться
                </button>
            `;
            form.addEventListener('submit', this.handleRegister);
            wrapper.appendChild(form);
        }

        this.container.appendChild(wrapper);
    }

    destroy() {
        // nothing to clean
    }
}