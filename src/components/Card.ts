import { Component } from "./base/Component";
import { IProduct, ICardActions } from "../types";
import { ensureElement } from "../utils/utils";

/**
 * Компонент карточки товара
 */
export class Card extends Component<IProduct> {
	protected _category?: HTMLElement | null;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement | null;
	protected _description?: HTMLElement | null;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement | null;
	protected _index?: HTMLElement | null; // Для номера в корзине

	// Маппинг категорий на классы для стилизации
	protected categoryMap: Record<string, string> = {
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		// Опциональные элементы ищем через querySelector
		this._category = container.querySelector('.card__category');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');

		// Привязываем обработчик клика, если он передан
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// Сеттеры для обновления данных карточки
	set id(value: string) {
		this.container.dataset.id = value;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value !== null ? `${value} синапсов` : 'Бесценно'
		);
		// Блокируем кнопку покупки, если цена null или это карточка без кнопки
		if (this._button) {
			this.setDisabled(this._button, value === null);
		}
	}

	set image(value: string) {
        // Используем текст из _title для alt, если он есть
		this.setImage(this._image, value, this._title?.textContent || '');
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		const categoryClassSuffix = this.categoryMap[value] ?? 'other';
		this._category?.classList.forEach((className) => {
			if (
				className.startsWith('card__category_') &&
				className !== 'card__category'
			) {
				this._category?.classList.remove(className);
			}
		});
		if (this._category) {
			this._category.classList.add(`card__category_${categoryClassSuffix}`);
		}
	}

	// Для кнопки "В корзину" / "Удалить"
	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	// Для номера в корзине
	set index(value: number) {
		this.setText(this._index, String(value));
	}

	// Метод для управления состоянием кнопки в карточке превью
	setInBasket(inBasket: boolean, price: number | null): void {
		if (this._button) {
			if (price === null) {
				// Если товар бесценен, кнопка неактивна
				this.buttonText = 'Недоступно';
				this.setDisabled(this._button, true);
			} else {
				this.buttonText = inBasket ? 'Убрать из корзины' : 'В корзину';
				this.setDisabled(this._button, false);
			}
		}
	}
}