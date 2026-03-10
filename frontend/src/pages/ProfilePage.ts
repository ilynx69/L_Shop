import { getState } from '../services/state.js';
import { deliveryApi } from '../services/api.js';
import { Delivery } from '../types/index.js';

export default class ProfilePage {
    private container: HTMLElement;
    private deliveries: Delivery[] = [];

    constructor(container: HTMLElement) {
        this.container = container;
        this.init();
    }

    private async init(): Promise<void> {
        const state = getState();
        
        // Если не авторизован — сразу рендерим заглушку и не мучаем API
        if (!state.isAuthenticated) {
            this.render();
            return;
        }

        await this.loadDeliveries();
    }

    private async loadDeliveries(): Promise<void> {
        try {
            // Ожидаем массив доставок с типизацией Delivery[]
            const data: Delivery[] = await deliveryApi.getUserDeliveries();
            this.deliveries = data;
            this.render();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Ошибка загрузки доставок:', errorMessage);
            
            this.container.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <p style="color: #ff4d4f; font-weight: bold;">⚠️ Не удалось загрузить историю доставок</p>
                    <button id="retry-load" style="cursor: pointer;">Повторить попытку</button>
                </div>
            `;

            this.container.querySelector('#retry-load')?.addEventListener('click', () => this.loadDeliveries());
        }
    }

    private handleCancel = async (deliveryId: string): Promise<void> => {
        if (!confirm('Отменить доставку?')) return;
        
        try {
            await deliveryApi.cancelDelivery(deliveryId);
            await this.loadDeliveries();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Cancel failed';
            alert(`Ошибка отмены: ${errorMessage}`);
        }
    };

    render(): void {
        const state = getState();

        if (!state.isAuthenticated) {
            this.container.innerHTML = `
                <section style="padding: 40px; text-align: center;">
                    <h2>Личный кабинет</h2>
                    <p>Для просмотра профиля <a href="/auth" style="color: #1890ff;">войдите в систему</a></p>
                </section>
            `;
            return;
        }

        let html = `
            <div class="profile-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
                <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    Профиль: ${state.user?.name || state.user?.login || 'Пользователь'}
                </h2>
                <div class="user-info" style="margin-bottom: 30px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                    <p><strong>Email:</strong> ${state.user?.email || 'не указан'}</p>
                    <p><strong>Телефон:</strong> ${state.user?.phone || 'не указан'}</p>
                </div>
                
                <h3>История доставок</h3>
        `;

        if (this.deliveries.length === 0) {
            html += '<p style="color: #888;">У вас пока нет активных или завершенных доставок.</p>';
        } else {
            html += '<ul style="list-style: none; padding: 0;">';
            this.deliveries.forEach((del: Delivery) => {
                const date = new Date(del.createdAt).toLocaleString('ru-RU');
                html += `
                    <li style="border: 1px solid #ddd; margin-bottom: 10px; padding: 15px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: bold; margin-bottom: 5px;">${date}</div>
                            <div style="font-size: 0.9em; color: #555;">${del.address}</div>
                            <div style="font-size: 0.8em; color: #888;">Оплата: ${del.paymentMethod === 'card' ? 'Картой' : 'Наличными'}</div>
                        </div>
                        <button class="cancel-delivery" data-id="${del.id}" 
                                style="background: #ff4d4f; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                            Отменить
                        </button>
                    </li>
                `;
            });
            html += '</ul>';
        }

        html += '</div>';
        this.container.innerHTML = html;

        this.container.querySelectorAll('.cancel-delivery').forEach(btn => {
            btn.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLButtonElement;
                const id = target.getAttribute('data-id');
                if (id) this.handleCancel(id);
            });
        });
    }

    destroy(): void {
        // Очистка таймеров или слушателей, если появятся в будущем
    }
}