import { IEvents } from '../base/events';
import { IProduct, IBasket, IOrder, IFormErrors } from '../../types';

/**
 * Класс состояния приложения
 */
export class AppState {
  /** Каталог товаров */
  private _items: IProduct[] = [];
  
  /** Корзина товаров */
  private _basket: IBasket = { items: [], total: 0 };
  
  /** Данные заказа */
  private _order: IOrder = {
    payment: 'card',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0
  };
  
  /** Ошибки формы */
  private _formErrors: IFormErrors = {};

  /**
   * Конструктор модели состояния
   * @param events Объект обработки событий
   */
  constructor(protected events: IEvents) {}

  /**
   * Полностью очищает состояние приложения
   */
  clearState(): void {
    this._items = [];
    this._basket = { items: [], total: 0 };
    this._order = {
      payment: 'card',
      email: '',
      phone: '',
      address: '',
      items: [],
      total: 0
    };
    this._formErrors = {};
    this.events.emit('state:cleared');
  }

  /**
   * Устанавливает список товаров
   * @param items Массив товаров
   */
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('items:changed', this._items);
  }

  /**
   * Добавляет товар в корзину
   * @param item Объект товара
   */
  addToBasket(item: IProduct): void {
    if (!this._basket.items.includes(item.id)) {
      this._basket.items.push(item.id);
      this.updateBasketTotal();
      this.events.emit('basket:changed', this._basket);
    }
  }

  /**
   * Удаляет товар из корзины
   * @param itemId Идентификатор товара
   */
  removeFromBasket(itemId: string): void {
    this._basket.items = this._basket.items.filter(id => id !== itemId);
    this.updateBasketTotal();
    this.events.emit('basket:changed', this._basket);
  }

  /**
   * Обновляет общую сумму корзины
   */
  private updateBasketTotal(): void {
    this._basket.total = this._basket.items.reduce((total, id) => {
      const item = this._items.find(product => product.id === id);
      return total + (item?.price || 0);
    }, 0);
  }

  // Геттеры
  get items(): IProduct[] {
    return this._items;
  }

  get basket(): IBasket {
    return this._basket;
  }

  get order(): IOrder {
    return this._order;
  }

  get formErrors(): IFormErrors {
    return this._formErrors;
  }
}