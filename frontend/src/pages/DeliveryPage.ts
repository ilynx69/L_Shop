import { state } from '../state';

export class DeliveryPage {
    constructor(private onNavigate: (path: string) => void) {}

    render(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'page-container';

        // Если не залогинен — не пускаем
        if (!state.isAuth()) {
            container.innerHTML = '<h1>Доступ запрещен. Войдите в систему.</h1>';
            setTimeout(() => this.onNavigate('/auth'), 2000);
            return container;
        }

        container.innerHTML = `
            <h1>Оформление заказа</h1>
            <form id="delivery-form" data-delivery="true">
                <input type="text" name="address" placeholder="Адрес доставки" required>
                <input type="tel" name="phone" placeholder="Телефон" required>
                <input type="email" name="email" placeholder="Email для чека" required>
                
                <select name="payment" required>
                    <option value="card">Картой на сайте</option>
                    <option value="cash">Наличными курьеру</option>
                </select>

                <button type="submit">Оформить доставку</button>
            </form>
        `;

        container.querySelector('#delivery-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Очищаем корзину через наш стейт (требование ТЗ)
            state.clearCart();
            
            alert('Заказ оформлен! Корзина очищена.');
            this.onNavigate('/'); // На главную
        });

        return container;
    }
}