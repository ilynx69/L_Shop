import { Product } from '../types/index.js';

export default class CartItem {
    private product: Product;
    private quantity: number;
    private onUpdate: (productId: string, newQuantity: number) => void;
    private onRemove: (productId: string) => void;

    constructor(
        product: Product,
        quantity: number,
        onUpdate: (productId: string, newQuantity: number) => void,
        onRemove: (productId: string) => void
    ) {
        this.product = product;
        this.quantity = quantity;
        this.onUpdate = onUpdate;
        this.onRemove = onRemove;
    }

    render(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'cart-item';

        const title = document.createElement('h4');
        title.setAttribute('data-title', 'basket');
        title.textContent = this.product.name;
        div.appendChild(title);

        const price = document.createElement('p');
        price.setAttribute('data-price', 'basket');
        price.textContent = `${this.product.price} ₽`;
        div.appendChild(price);

        const controls = document.createElement('div');

        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '-';
        decreaseBtn.disabled = this.quantity <= 1;
        decreaseBtn.addEventListener('click', () => this.onUpdate(this.product.id, this.quantity - 1));
        controls.appendChild(decreaseBtn);

        const qtySpan = document.createElement('span');
        qtySpan.style.margin = '0 10px';
        qtySpan.textContent = this.quantity.toString();
        controls.appendChild(qtySpan);

        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.addEventListener('click', () => this.onUpdate(this.product.id, this.quantity + 1));
        controls.appendChild(increaseBtn);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Удалить';
        removeBtn.style.marginLeft = '20px';
        removeBtn.addEventListener('click', () => this.onRemove(this.product.id));
        controls.appendChild(removeBtn);

        div.appendChild(controls);

        return div;
    }
}