import { Product } from '../types/index.js';

export default class ProductCard {
    private product: Product;
    private onAdd: (productId: string, quantity: number) => void;
    private isAuthenticated: boolean;

    constructor(product: Product, onAdd: (productId: string, quantity: number) => void, isAuthenticated: boolean) {
        this.product = product;
        this.onAdd = onAdd;
        this.isAuthenticated = isAuthenticated;
    }

    render(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'product-card';

        const title = document.createElement('h3');
        title.setAttribute('data-title', '');
        title.textContent = this.product.name;
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = this.product.description;
        card.appendChild(desc);

        const price = document.createElement('p');
        price.setAttribute('data-price', '');
        price.textContent = `${this.product.price} ₽`;
        card.appendChild(price);

        const category = document.createElement('p');
        category.textContent = `Категория: ${this.product.category}`;
        card.appendChild(category);

        const available = document.createElement('p');
        available.textContent = this.product.available ? 'В наличии' : 'Нет в наличии';
        card.appendChild(available);

        if (this.product.available) {
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.value = '1';
            quantityInput.style.width = '60px';
            quantityInput.style.marginRight = '10px';
            card.appendChild(quantityInput);

            const addButton = document.createElement('button');
            addButton.textContent = 'Добавить в корзину';
            addButton.addEventListener('click', () => {
                if (!this.isAuthenticated) {
                    alert('Необходимо авторизоваться');
                    return;
                }
                const qty = parseInt(quantityInput.value, 10) || 1;
                this.onAdd(this.product.id, qty);
            });
            card.appendChild(addButton);
        }

        return card;
    }
}