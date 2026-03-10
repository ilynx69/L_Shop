import { getState } from '../services/state.js';
import { deliveryApi, cartApi } from '../services/api.js';
import { router } from '../router.js';

export default class DeliveryPage {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    private handleSubmit = async (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const deliveryData = {
            address: formData.get('address') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            paymentMethod: formData.get('payment') as string,
        };

        try {
            await deliveryApi.create(deliveryData);
            await cartApi.clearCart();
            (window as any).showNotification('Доставка оформлена, корзина очищена', 'success');
            router.navigateTo('/');
        } catch (error) {
            (window as any).showNotification('Ошибка оформления доставки', 'error');
            console.error(error);
        }
    };

    render() {
        this.container.innerHTML = '';

        const state = getState();
        if (!state.isAuthenticated) {
            const msg = document.createElement('p');
            msg.innerHTML = 'Для оформления доставки <a href="/auth">войдите</a>';
            msg.style.textAlign = 'center';
            msg.style.padding = '50px';
            msg.style.background = 'white';
            msg.style.borderRadius = '15px';
            msg.style.boxShadow = '0 5px 15px rgba(0,40,0,0.1)';
            msg.style.color = '#666';
            this.container.appendChild(msg);
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.style.maxWidth = '500px';
        wrapper.style.margin = '0 auto';
        wrapper.style.padding = '30px';
        wrapper.style.backgroundColor = 'white';
        wrapper.style.borderRadius = '15px';
        wrapper.style.boxShadow = '0 5px 15px rgba(0, 40, 0, 0.1)';
        wrapper.style.position = 'relative';
        wrapper.style.overflow = 'hidden';

        const topBar = document.createElement('div');
        topBar.style.position = 'absolute';
        topBar.style.top = '0';
        topBar.style.left = '0';
        topBar.style.right = '0';
        topBar.style.height = '5px';
        topBar.style.background = 'linear-gradient(90deg, #1a3b2e, #c6a15b)';
        wrapper.appendChild(topBar);

        const title = document.createElement('h1');
        title.textContent = 'Оформление доставки';
        title.style.color = '#1a3b2e';
        title.style.fontSize = '2rem';
        title.style.marginBottom = '30px';
        title.style.borderBottom = '3px solid #c6a15b';
        title.style.paddingBottom = '10px';
        title.style.display = 'inline-block';
        wrapper.appendChild(title);

        const form = document.createElement('form');
        form.setAttribute('data-delivery', '');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '15px';

        form.innerHTML = `
            <input type="text" name="address" placeholder="Адрес доставки" required
                style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
            <input type="tel" name="phone" placeholder="Телефон" required
                style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
            <input type="email" name="email" placeholder="Email" required
                style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px;">
            <select name="payment" required
                style="padding: 12px; border: 2px solid #ddd; border-radius: 30px; font-size: 16px; background-color: white;">
                <option value="card">Оплата картой</option>
                <option value="cash">Оплата наличными</option>
            </select>
            <button type="submit"
                style="background: linear-gradient(135deg, #2a5a45, #1a3b2e); color: white; border: none; padding: 12px; border-radius: 30px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s; margin-top: 10px;">
                Подтвердить заказ
            </button>
        `;

        form.addEventListener('submit', this.handleSubmit);
        wrapper.appendChild(form);
        this.container.appendChild(wrapper);
    }

    destroy() {
        // nothing to clean
    }
}