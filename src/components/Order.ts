import { Form } from './common/Form';
import { IOrderForm, IFormState, PaymentMethod } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Order extends Form<IOrderForm> {
	protected _paymentCard: HTMLButtonElement;
	protected _paymentCash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events, 'order');

		this._paymentCard = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			container
		);
		this._paymentCash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			container
		);
		this._address = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);

		// Обработчики изменений
		this._paymentCard.addEventListener('click', () => {
			this.payment = 'card';
			events.emit('order.payment:change', { field: 'payment', value: 'card' });
		});

		this._paymentCash.addEventListener('click', () => {
			this.payment = 'cash';
			events.emit('order.payment:change', { field: 'payment', value: 'cash' });
		});

		this._address.addEventListener('input', () => {
			events.emit('order.address:change', {
				field: 'address',
				value: this._address.value,
			});
		});

		this.container.addEventListener('submit', (event) => {
			event.preventDefault(); // Предотвращаем отправку формы
			events.emit('order:submit'); // Переход к шагу 2
		});
	}

	set payment(value: PaymentMethod) {
		this._paymentCard.classList.toggle('button_alt-active', value === 'card');
		this._paymentCash.classList.toggle('button_alt-active', value === 'cash');
	}

	set address(value: string) {
		this._address.value = value;
	}

	render(state: IFormState & Partial<IOrderForm>): HTMLElement {
		super.render(state);
        if (state.payment) this.payment = state.payment;
		this.address = state.address ?? '';
		return this.container;
	}
}