import { getState, subscribe, setState } from '../services/state.js';
import { productsApi, cartApi } from '../services/api.js';
import { Product, ProductQueryParams } from '../types/index.js';
import { ProductCard, SearchBar, Filters } from '../components/index.js';
import { router } from '../router.js';

export default class HomePage {
    private container: HTMLElement;
    private products: Product[] = [];
    private categories: string[] = [];
    private search: string = '';
    private selectedCategory: string = '';
    private showAvailableOnly: boolean = false;
    private sort: string = '';
    private unsubscribeState: (() => void) | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.loadCategories();
        this.loadProducts();
        this.unsubscribeState = subscribe(() => this.render());
    }

    private async loadCategories() {
        try {
            this.categories = await productsApi.getCategories();
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        }
    }

    private async loadProducts() {
        try {
            const params: ProductQueryParams = {};
            if (this.search) params.q = this.search;
            if (this.sort) params.sort = this.sort as any;
            if (this.selectedCategory) params.category = this.selectedCategory;
            if (this.showAvailableOnly) params.available = true;

            this.products = await productsApi.getProducts(params);
            this.render();
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    private handleAddToCart = async (productId: string, quantity: number) => {
        try {
            await cartApi.addItem(productId, quantity);
            alert('Товар добавлен в корзину');
        } catch (error) {
            alert('Ошибка добавления');
        }
    };

    private handleSearchChange = (value: string) => {
        this.search = value;
        this.loadProducts();
    };

    private handleCategoryChange = (category: string) => {
        this.selectedCategory = category;
        this.loadProducts();
    };

    private handleAvailableChange = (value: boolean) => {
        this.showAvailableOnly = value;
        this.loadProducts();
    };

    private handleSortChange = (sort: string) => {
        this.sort = sort;
        this.loadProducts();
    };

    render() {
        this.container.innerHTML = '';

        const state = getState();

        const searchBar = new SearchBar(this.search, this.handleSearchChange);
        this.container.appendChild(searchBar.render());

        const filters = new Filters(
            this.categories,
            this.selectedCategory,
            this.handleCategoryChange,
            this.showAvailableOnly,
            this.handleAvailableChange,
            this.sort,
            this.handleSortChange
        );
        this.container.appendChild(filters.render());

        const productsContainer = document.createElement('div');
        productsContainer.style.display = 'flex';
        productsContainer.style.flexWrap = 'wrap';

        this.products.forEach(product => {
            const card = new ProductCard(product, this.handleAddToCart, state.isAuthenticated);
            productsContainer.appendChild(card.render());
        });

        this.container.appendChild(productsContainer);
    }

    destroy() {
        if (this.unsubscribeState) this.unsubscribeState();
    }
}