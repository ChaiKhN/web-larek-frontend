import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IPage } from "../types";

/**
 * Компонент управления главной страницей
 */
export class Page extends Component<IPage> {
    private _counter: HTMLElement;
    private _catalog: HTMLElement;
    private _wrapper: HTMLElement;
    private _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container); // Передаем body в базовый компонент

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        // Обработчик клика на иконку корзины
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // Установить значение счетчика корзины
    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    // Заменить содержимое каталога новыми элементами
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    // Заблокировать/разблокировать прокрутку страницы
    set locked(value: boolean) {
         this.toggleClass.call({container: this._wrapper}, 'page__wrapper_locked', value); // Используем call для смены контекста this
    }
}