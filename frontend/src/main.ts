import { initRouter } from './router.js';
import { setState } from './services/state.js';
import HomePage from './pages/HomePage.js';
import CartPage from './pages/CartPage.js';
import AuthPage from './pages/AuthPage.js';

const app = document.getElementById('app');
if (!app) throw new Error('#app not found');

const router = initRouter(app);

// Навигация
const nav = document.createElement('nav');
nav.innerHTML = `
    <a href="/" data-link>Главная</a>
    <a href="/cart" data-link>Корзина</a>
    <a href="/auth" data-link>Вход / Регистрация</a>
`;
document.body.insertBefore(nav, app);

// Обработка кликов по ссылкам с data-link
document.body.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('[data-link]')) {
        e.preventDefault();
        const href = target.getAttribute('href');
        if (href) router.navigateTo(href);
    }
});

// Для теста делаем пользователя авторизованным (позже фронт2 будет управлять)
setState({ isAuthenticated: true, userId: 'test-user' });

let currentPage: HomePage | CartPage | AuthPage | null = null;

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

router.start();