import { Component } from "../base/Component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { IModalData } from "../../types";

/**
 * Компонент модального окна
 */
export class Modal extends Component<IModalData> {
    private _closeButton: HTMLButtonElement;
    private _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Обработчики закрытия
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('mousedown', (evt) => {
            // Закрываем по клику на оверлей (сам контейнер модалки)
            if (evt.target === this.container) {
                this.close();
            }
        });
        // Предотвращаем закрытие по клику на контент внутри модалки
        this._content.addEventListener('mousedown', (event) => event.stopPropagation());
    }

    // Установить содержимое модального окна
    set content(value: HTMLElement | null) {
        if (value) {
            this._content.replaceChildren(value);
        } else {
            // Очищаем контент, если передали null
            this._content.innerHTML = '';
        }
    }

    // Открыть модальное окно
    open(): void {
        super.toggleClass('modal_active', true); // Используем метод базового класса
        this.events.emit('modal:open');
    }

    // Закрыть модальное окно
    close(): void {
        super.toggleClass('modal_active', false);
        this.content = null; // Очищаем контент при закрытии
        this.events.emit('modal:close');
    }

    // Переопределяем render для удобной установки контента при открытии
    render(data: IModalData): HTMLElement {
        // super.render(data); // Не нужно, т.к. базовый рендер пуст
        this.content = data.content; // Устанавливаем контент
        return this.container;
    }
}