import { state } from '../state';

export class AuthPage {
    private isLogin: boolean = true;

    constructor(private onNavigate: (path: string) => void) {}

    render(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'page-container';

        container.innerHTML = `
            <h1>${this.isLogin ? 'Вход' : 'Регистрация'}</h1>
            <form id="auth-form" ${!this.isLogin ? 'data-registration="true"' : ''}>
                ${!this.isLogin ? '<input type="text" name="name" placeholder="Имя" required>' : ''}
                <input type="text" name="login" placeholder="Логин" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Пароль" required>
                <button type="submit">${this.isLogin ? 'Войти' : 'Создать аккаунт'}</button>
            </form>
            <button id="switch-mode" style="background:none; color:blue; border:none; cursor:pointer; margin-top:10px;">
                ${this.isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
            </button>
        `;

        // Обработка переключения Логин/Регистрация
        container.querySelector('#switch-mode')?.addEventListener('click', () => {
            this.isLogin = !this.isLogin;
            const root = document.getElementById('root')!;
            root.innerHTML = '';
            root.appendChild(this.render());
        });

        // Обработка отправки формы
        container.querySelector('#auth-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            
            // Сохраняем в наш state.ts
            state.user = {
                email: formData.get('email') as string,
                login: formData.get('login') as string
            };

            alert('Вы успешно вошли!');
            this.onNavigate('/delivery'); // Кидаем на доставку
        });

        return container;
    }
}