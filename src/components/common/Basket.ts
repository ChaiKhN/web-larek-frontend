import { Component } from "../base/Component";
import { IBasket } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

/**
 * Компонент корзины
 */
export class Basket extends Component<IBasket> {
    private _list: HTMLElement;
    private _total: HTMLElement;
    private _button: HTMLButtonElement; // Кнопка "Оформить"

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        // Клик на кнопку "Оформить" инициирует начало заказа
        this._button.addEventListener('click', () => {
            this.events.emit('order:start');
        });

        // Изначально корзина пуста
        this.items = [];
        this.total = 0;
    }

    // Установить элементы списка товаров в корзине
    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._button, false); // Активируем кнопку "Оформить"
        } else {
            // Показываем сообщение о пустой корзине
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._button, true); // Деактивируем кнопку "Оформить"
        }
    }

    // Установить общую стоимость товаров
    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }
}