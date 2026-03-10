import { AuthPage } from './pages/AuthPage';
import { DeliveryPage } from './pages/DeliveryPage';

const root = document.getElementById('root')!;

// Функция навигации
function navigate(path: string) {
    root.innerHTML = ''; // Очищаем экран

    if (path === '/auth') {
        const page = new AuthPage(navigate);
        root.appendChild(page.render());
    } 
    else if (path === '/delivery') {
        const page = new DeliveryPage(navigate);
        root.appendChild(page.render());
    } 
    else {
        root.innerHTML = `
            <h1>L_Shop Главная</h1>
            <button id="to-auth">Перейти к авторизации</button>
        `;
        document.getElementById('to-auth')?.addEventListener('click', () => navigate('/auth'));
    }

    // Обновляем URL без перезагрузки (для красоты)
    window.history.pushState({}, '', path);
}

// Запуск приложения
navigate('/auth');