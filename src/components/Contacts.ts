import { Form } from "./common/Form";
import { IOrderForm, IFormState } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

/**
 * Компонент формы заказа - Шаг 2 (Контакты)
 */
export class Contacts extends Form<IOrderForm> {
    private _emailInput: HTMLInputElement;
    private _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); // Передаем контейнер и события в базовый класс Form

        // Находим элементы управления этого шага
        this._emailInput = ensureElement<HTMLInputElement>('input[name=email]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', container);
    }

    // Сеттеры для установки начальных/текущих значений полей
    set email(value: string) {
        this._emailInput.value = value;
    }
    set phone(value: string) {
        this._phoneInput.value = value;
    }

     // Переопределяем render базового класса Form
    render(state: IFormState & Partial<IOrderForm>): HTMLElement {
        // Сначала вызываем render базового класса, чтобы установить valid и errors
        super.render(state);
        // Затем устанавливаем значения полей этой формы
        this.email = state.email ?? '';
        this.phone = state.phone ?? '';
        return this.container;
    }
}