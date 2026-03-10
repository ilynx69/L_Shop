export default class Filters {
    private categories: string[];
    private selectedCategory: string;
    private onCategoryChange: (category: string) => void;
    private showAvailableOnly: boolean;
    private onAvailableChange: (value: boolean) => void;
    private sort: string;
    private onSortChange: (sort: string) => void;

    constructor(
        categories: string[],
        selectedCategory: string,
        onCategoryChange: (category: string) => void,
        showAvailableOnly: boolean,
        onAvailableChange: (value: boolean) => void,
        sort: string,
        onSortChange: (sort: string) => void
    ) {
        this.categories = categories;
        this.selectedCategory = selectedCategory;
        this.onCategoryChange = onCategoryChange;
        this.showAvailableOnly = showAvailableOnly;
        this.onAvailableChange = onAvailableChange;
        this.sort = sort;
        this.onSortChange = onSortChange;
    }

    render(): HTMLElement {
        const container = document.createElement('div');
        container.style.marginBottom = '20px';
        container.style.padding = '10px';
        container.style.backgroundColor = '#f5f5f5';

        // Сортировка
        const sortDiv = document.createElement('div');
        sortDiv.style.marginBottom = '10px';
        sortDiv.innerHTML = '<label>Сортировка по цене: </label>';
        const sortSelect = document.createElement('select');
        sortSelect.value = this.sort;
        sortSelect.innerHTML = `
            <option value="">Без сортировки</option>
            <option value="price_asc">Сначала дешёвые</option>
            <option value="price_desc">Сначала дорогие</option>
        `;
        sortSelect.addEventListener('change', (e) => {
            this.onSortChange((e.target as HTMLSelectElement).value);
        });
        sortDiv.appendChild(sortSelect);
        container.appendChild(sortDiv);

        // Категория
        const catDiv = document.createElement('div');
        catDiv.style.marginBottom = '10px';
        catDiv.innerHTML = '<label>Категория: </label>';
        const catSelect = document.createElement('select');
        catSelect.value = this.selectedCategory;
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'Все категории';
        catSelect.appendChild(allOption);
        this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            catSelect.appendChild(option);
        });
        catSelect.addEventListener('change', (e) => {
            this.onCategoryChange((e.target as HTMLSelectElement).value);
        });
        catDiv.appendChild(catSelect);
        container.appendChild(catDiv);

        // Доступность
        const availDiv = document.createElement('div');
        const availCheck = document.createElement('input');
        availCheck.type = 'checkbox';
        availCheck.checked = this.showAvailableOnly;
        availCheck.addEventListener('change', (e) => {
            this.onAvailableChange((e.target as HTMLInputElement).checked);
        });
        const availLabel = document.createElement('label');
        availLabel.appendChild(availCheck);
        availLabel.append(' Только в наличии');
        availDiv.appendChild(availLabel);
        container.appendChild(availDiv);

        return container;
    }
}