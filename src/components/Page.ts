import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IPage } from "../types";

export class Page extends Component<IPage> {
    private _counter: HTMLElement;
    private _catalog: HTMLElement;
    private _wrapper: HTMLElement;
    private _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        this.toggleClass.call({container: this._wrapper}, 'page__wrapper_locked', value);
    }
}