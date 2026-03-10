import { initRouter } from './router.js';
import { getState, setState, subscribe } from './services/state.js';
import { authApi } from './services/api.js';
import HomePage from './pages/HomePage.js';
import CartPage from './pages/CartPage.js';
import AuthPage from './pages/AuthPage.js';
import DeliveryPage from './pages/DeliveryPage.js';
import ProfilePage from './pages/ProfilePage.js';

const app = document.getElementById('app');
if (!app) throw new Error('#app not found');

const router = initRouter(app);

// Глобальная функция уведомлений
(window as any).showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.backgroundColor = type === 'success' ? '#2a5a45' : '#c0392b';
    notification.style.color = 'white';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.transition = 'opacity 0.3s';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Шапка сайта (навигация + профиль)
const header = document.createElement('header');
header.style.display = 'flex';
header.style.justifyContent = 'space-between';
header.style.alignItems = 'center';
header.style.backgroundColor = '#f0f0f0';
header.style.padding = '10px 30px';

const nav = document.createElement('nav');
nav.innerHTML = `
    <a href="/" data-link style="margin-right:15px;">Главная</a>
    <a href="/cart" data-link style="margin-right:15px;">Корзина</a>
    <a href="/delivery" data-link>Доставка</a>
`;
header.appendChild(nav);

const userInfo = document.createElement('div');
userInfo.id = 'user-info';
header.appendChild(userInfo);
document.body.insertBefore(header, app);

// Обработка кликов по ссылкам с data-link
document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('[data-link]')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) router.navigateTo(href);
    }
});

// Обновление блока пользователя при изменении состояния
const updateUserInfo = () => {
    const state = getState();
    if (state.isAuthenticated && state.user) {
        userInfo.innerHTML = `
            <span style="margin-right:15px;">Привет, ${state.user.name || state.user.login}!</span>
            <a href="/profile" data-link style="margin-right:15px; color:#1a3b2e;">Профиль</a>
            <button id="logout-btn" style="padding:5px 10px; background:#1a3b2e; color:white; border:none; border-radius:5px; cursor:pointer;">Выйти</button>
        `;
        document.getElementById('logout-btn')?.addEventListener('click', async () => {
            try {
                await authApi.logout();
                setState({ isAuthenticated: false, user: null });
                router.navigateTo('/');
            } catch (error) {
                (window as any).showNotification('Ошибка выхода', 'error');
            }
        });
    } else {
        userInfo.innerHTML = `<a href="/auth" data-link style="text-decoration:none; color:#1a3b2e;">Вход / Регистрация</a>`;
    }
};

subscribe(updateUserInfo);

// При загрузке приложения пытаемся получить информацию о пользователе
(async () => {
    try {
        const result = await authApi.getMe();
        setState({ isAuthenticated: true, user: result.user });
    } catch {
        setState({ isAuthenticated: false, user: null });
    }
})();

// Текущая страница для корректного уничтожения
let currentPage: HomePage | CartPage | AuthPage | DeliveryPage | ProfilePage | null = null;

// Роуты
router.addRoute('/', () => {
    if (currentPage) currentPage.destroy?.();
    currentPage = new HomePage(app);
    currentPage.render();
});

router.addRoute('/cart', () => {
    if (currentPage) currentPage.destroy?.();
    currentPage = new CartPage(app);
    currentPage.render();
});

router.addRoute('/auth', () => {
    if (currentPage) currentPage.destroy?.();
    currentPage = new AuthPage(app);
    currentPage.render();
});

router.addRoute('/delivery', () => {
    if (currentPage) currentPage.destroy?.();
    currentPage = new DeliveryPage(app);
    currentPage.render();
});

router.addRoute('/profile', () => {
    if (currentPage) currentPage.destroy?.();
    currentPage = new ProfilePage(app);
    currentPage.render();
});

router.start();
updateUserInfo(); // на всякий случай вызвать ещё раз