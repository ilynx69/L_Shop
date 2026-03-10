export default class SearchBar {
    private value: string;
    private onChange: (value: string) => void;

    constructor(value: string, onChange: (value: string) => void) {
        this.value = value;
        this.onChange = onChange;
    }

    render(): HTMLElement {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Поиск товаров...';
        input.value = this.value;
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '10px';
        input.addEventListener('input', (e) => {
            this.onChange((e.target as HTMLInputElement).value);
        });
        return input;
    }
}