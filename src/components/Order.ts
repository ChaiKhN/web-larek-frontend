import { Form } from "./common/Form";
import { IOrderForm, PaymentMethod, IFormState } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

/**
 * Компонент формы заказа - Шаг 1 (Оплата и Адрес)
 */
export class Order extends Form<IOrderForm> {
    private _paymentCardButton: HTMLButtonElement;
    private _paymentCashButton: HTMLButtonElement;
    private _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Передаем контейнер и события в базовый класс Form

        // Находим элементы управления этого шага
        this._paymentCardButton = ensureElement<HTMLButtonElement>('button[name=card]', container);
        this._paymentCashButton = ensureElement<HTMLButtonElement>('button[name=cash]', container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);

        // Обработчики кликов на кнопки оплаты
        this._paymentCardButton.addEventListener('click', () => {
            this.setActivePayment('card');
            // Сообщаем об изменении поля 'payment'
            this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
        });
         this._paymentCashButton.addEventListener('click', () => {
            this.setActivePayment('cash');
            // Сообщаем об изменении поля 'payment'
            this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
        });
    }

    // Метод для визуального выделения активного способа оплаты
    private setActivePayment(method: PaymentMethod): void {
        this.toggleClass.call({container: this._paymentCardButton}, 'button_alt-active', method === 'card');
        this.toggleClass.call({container: this._paymentCashButton}, 'button_alt-active', method === 'cash');
    }

    // Сеттеры для установки начальных/текущих значений полей
    set payment(method: PaymentMethod) {
        this.setActivePayment(method);
        // Не эмитируем событие здесь, чтобы избежать зацикливания при инициализации из render
    }
    set address(value: string) {
        this._addressInput.value = value;
         // Не эмитируем событие здесь
    }

    // Переопределяем render базового класса Form
    render(state: IFormState & Partial<IOrderForm>): HTMLElement {
        // Сначала вызываем render базового класса, чтобы установить valid и errors
        super.render(state);
        // Затем устанавливаем значения полей этой формы
        this.payment = state.payment ?? 'card'; // Устанавливаем способ оплаты (по умолчанию 'card')
        this.address = state.address ?? ''; // Устанавливаем адрес
        return this.container;
    }
}