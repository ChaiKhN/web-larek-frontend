import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IFormState } from "../../types";

/**
 * Базовый класс для форм
 */
export abstract class Form<T extends object> extends Component<IFormState> {
    protected _submitButton: HTMLButtonElement;
    protected _errorsContainer: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

        // Обработчик ввода для всех полей формы
        container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            // Эмитируем событие об изменении конкретного поля для данной формы
			this.events.emit(`${container.name}.${String(field)}:change`, { field, value });
		});

        // Обработчик отправки формы
        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            // Эмитируем событие отправки для конкретной формы (order или contacts)
            this.events.emit(`${container.name}:submit`);
        });
    }

    // Метод для обновления состояния валидности кнопки отправки
    set valid(isValid: boolean) {
        this.setDisabled(this._submitButton, !isValid);
    }

    // Метод для отображения ошибок формы
    set errors(value: string[]) {
        this.setText(this._errorsContainer, value.join('; '));
    }

    // Общий render для форм, который принимает состояние валидности/ошибок
    // и может быть расширен в дочерних классах для установки значений полей
    render(state: IFormState & Partial<T>): HTMLElement {
        this.valid = state.valid;
        this.errors = state.errors;
        // Применяем остальные свойства state к текущему объекту (для сеттеров вроде address, email и т.д.)
        Object.assign(this, state);
        return this.container;
    }
}