import { getState, subscribe, setState } from '../services/state.js';
import { cartApi, productsApi } from '../services/api.js';
import { Product, Cart } from '../types/index.js';
import { CartItem } from '../components/index.js';
import { router } from '../router.js';

export default class CartPage {
    private container: HTMLElement;
    private cart: Cart | null = null;
    private productsMap: Map<string, Product> = new Map();
    private unsubscribeState: (() => void) | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.loadCart();
        this.unsubscribeState = subscribe(() => this.render());
    }

    private async loadCart() {
        const state = getState();
        if (!state.isAuthenticated) {
            this.render();
            return;
        }

        try {
            this.cart = await cartApi.getCart();
            if (this.cart.items.length > 0) {
                const productIds = this.cart.items.map(item => item.productId);
                const allProducts = await productsApi.getProducts();
                this.productsMap.clear();
                allProducts.forEach(p => {
                    if (productIds.includes(p.id)) {
                        this.productsMap.set(p.id, p);
                    }
                });
            }
            setState({ cart: this.cart });
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        }
    }

    private handleUpdateQuantity = async (productId: string, newQuantity: number) => {
        try {
            await cartApi.updateItem(productId, newQuantity);
            await this.loadCart();
        } catch (error) {
            alert('Ошибка обновления');
        }
    };

    private handleRemove = async (productId: string) => {
        try {
            await cartApi.removeItem(productId);
            await this.loadCart();
        } catch (error) {
            alert('Ошибка удаления');
        }
    };

    render() {
        this.container.innerHTML = '';

        const state = getState();

        if (!state.isAuthenticated) {
            const msg = document.createElement('p');
            msg.innerHTML = 'Пожалуйста, <a href="/auth">войдите</a> для просмотра корзины.';
            msg.style.textAlign = 'center';
            msg.style.padding = '50px';
            this.container.appendChild(msg);
            return;
        }

        if (!this.cart || this.cart.items.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'Корзина пуста';
            empty.style.textAlign = 'center';
            empty.style.padding = '50px';
            this.container.appendChild(empty);
            return;
        }

        this.cart.items.forEach(item => {
            const product = this.productsMap.get(item.productId);
            if (product) {
                const cartItem = new CartItem(
                    product,
                    item.quantity,
                    this.handleUpdateQuantity,
                    this.handleRemove
                );
                this.container.appendChild(cartItem.render());
            }
        });

        let total = 0;
        this.cart.items.forEach(item => {
            const product = this.productsMap.get(item.productId);
            if (product) total += product.price * item.quantity;
        });

        const totalEl = document.createElement('div');
        totalEl.style.marginTop = '20px';
        totalEl.style.fontSize = '1.2em';
        totalEl.innerHTML = `<strong>Итого: ${total} ₽</strong>`;
        this.container.appendChild(totalEl);

        // Кнопка оформления заказа
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Оформить заказ';
        checkoutButton.style.marginTop = '20px';
        checkoutButton.style.padding = '12px 30px';
        checkoutButton.style.background = 'linear-gradient(135deg, #2a5a45, #1a3b2e)';
        checkoutButton.style.color = 'white';
        checkoutButton.style.border = 'none';
        checkoutButton.style.borderRadius = '30px';
        checkoutButton.style.fontSize = '16px';
        checkoutButton.style.fontWeight = '600';
        checkoutButton.style.cursor = 'pointer';
        checkoutButton.onclick = () => router.navigateTo('/delivery');
        this.container.appendChild(checkoutButton);
    }

    destroy() {
        if (this.unsubscribeState) this.unsubscribeState();
    }
}