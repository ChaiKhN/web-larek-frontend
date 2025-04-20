import { Form } from './common/Form';
import { IOrderForm, IFormState } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Contacts extends Form<IOrderForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events, 'contacts');

		this._email = ensureElement<HTMLInputElement>('input[name="email"]', container);
		this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', container);

		// Обработчики изменений полей
		this._email.addEventListener('input', () => {
			this.events.emit('contacts.email:change', {
				field: 'email',
				value: this._email.value,
			});
		});

		this._phone.addEventListener('input', () => {
			this.events.emit('contacts.phone:change', {
				field: 'phone',
				value: this._phone.value,
			});
		});

		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	// Явно объявляем сеттеры
	set email(value: string) {
		this._email.value = value;
	}
	// get email(): string { return this._email.value; } // REMOVED

	set phone(value: string) {
		this._phone.value = value;
	}

	render(state: IFormState & Partial<IOrderForm>): HTMLElement {
		super.render(state);
		this.email = state.email ?? '';
		this.phone = state.phone ?? '';
		return this.container;
	}
}