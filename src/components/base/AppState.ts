import { IEvents } from '../base/events';
import { IProduct, IBasket, IOrder, IOrderForm, IFormErrors, PaymentMethod } from '../../types';

/**
 * Класс состояния приложения
 */
export class AppState {
  catalog: IProduct[] = [];
  basket: IBasket = { items: [], total: 0 };
  preview: string | null = null;
  order: IOrder = {
    payment: 'card',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0
  };
  formErrors: IFormErrors = {};

  constructor(protected events: IEvents) {}

  setCatalog(items: IProduct[]): void {
    this.catalog = items;
    this.events.emit('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProduct): void {
    this.preview = item.id;
    this.events.emit('preview:changed', item);
  }

  isInBasket(itemId: string): boolean {
    return this.basket.items.includes(itemId);
  }

  addToBasket(item: IProduct): void {
    if (item.price !== null && !this.isInBasket(item.id)) {
      this.basket.items.push(item.id);
      this.updateBasket();
    }
  }

  removeFromBasket(itemId: string): void {
    this.basket.items = this.basket.items.filter(id => id !== itemId);
    this.updateBasket();
  }

  clearBasket(): void {
    this.basket.items = [];
    this.basket.total = 0;
    this.order.items = [];
    this.order.total = 0;
    this.events.emit('basket:changed', this.basket);
  }

  private updateBasket(): void {
    this.basket.total = this.basket.items.reduce((total, id) => {
      const item = this.catalog.find(product => product.id === id);
      return total + (item?.price || 0);
    }, 0);
    this.order.items = this.basket.items;
    this.order.total = this.basket.total;
    this.events.emit('basket:changed', this.basket);
  }

  setOrderField(field: keyof IOrderForm, value: string): void {
    this.order[field] = value as PaymentMethod;
    
    if (field === 'payment' || field === 'address') {
      this.validateOrderStep1();
    } else if (field === 'email' || field === 'phone') {
      this.validateOrderStep2();
    }
    
    this.events.emit('formErrors:change', this.formErrors);
  }

  validateOrderStep1(): boolean {
    const errors: IFormErrors = {};
    
    if (!this.order.payment) {
      errors.payment = 'Выберите способ оплаты';
    }
    
    if (!this.order.address || this.order.address.trim().length < 5) {
      errors.address = 'Адрес должен содержать минимум 5 символов';
    }
    
    this.updateFormErrors(errors, ['payment', 'address']);
    return Object.keys(errors).length === 0;
  }

  validateOrderStep2(): boolean {
    const errors: IFormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d[\d\s\-()]{8,}\d$/;

    if (!this.order.email) {
      errors.email = 'Введите email';
    } else if (!emailRegex.test(this.order.email)) {
      errors.email = 'Некорректный email';
    }

    if (!this.order.phone) {
      errors.phone = 'Введите телефон';
    } else if (!phoneRegex.test(this.order.phone)) {
      errors.phone = 'Некорректный телефон';
    }

    this.updateFormErrors(errors, ['email', 'phone']);
    return Object.keys(errors).length === 0;
  }

  private updateFormErrors(newErrors: IFormErrors, fields: (keyof IFormErrors)[]): void {
    // Очищаем только те ошибки, которые относятся к текущему шагу
    fields.forEach(field => {
      if (!newErrors[field]) {
        delete this.formErrors[field];
      } else {
        this.formErrors[field] = newErrors[field];
      }
    });
  }

  getOrder(): IOrder {
    return {
      ...this.order,
      items: this.basket.items,
      total: this.basket.total
    };
  }

  clearOrder(): void {
    this.order = {
      payment: 'card',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    };
    this.formErrors = {};
    this.events.emit('formErrors:change', this.formErrors);
  }
}