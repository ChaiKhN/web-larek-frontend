import { Component } from "./base/Component";
import { ISuccess, ISuccessActions } from "../types";
import { ensureElement } from "../utils/utils";

/**
 * Компонент отображения успешного заказа
 */
export class Success extends Component<ISuccess> {
    private _totalElement: HTMLElement;
    private _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this._totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        // Привязываем действие на кнопку закрытия
        if (actions.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    // Установить текст с итоговой суммой
    set total(value: number) {
        this.setText(this._totalElement, `Списано ${value} синапсов`);
    }
}