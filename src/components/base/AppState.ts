import { IEvents } from '../base/events';
import { IProduct, IBasket, IOrder, IOrderForm, IFormErrors, PaymentMethod } from '../../types';

/**
 * Класс состояния приложения
 */
export class AppState {
  /** Каталог товаров */
  catalog: IProduct[] = [];
  /** Корзина товаров */
  basket: IBasket = { items: [], total: 0 };
  /** Предпросмотр товара (ID) */
  preview: string | null = null;
  /** Данные заказа */
  order: IOrder = {
    payment: 'card',
    email: '',
    phone: '',
    address: '',
    items: [],
    total: 0
  };
  /** Ошибки формы */
  formErrors: IFormErrors = {};

  /**
   * Конструктор модели состояния
   * @param events Объект обработки событий
   */
  constructor(protected events: IEvents) {}

  /**
   * Устанавливает список товаров каталога
   * @param items Массив товаров
   */
  setCatalog(items: IProduct[]): void {
    this.catalog = items;
    this.events.emit('items:changed', { catalog: this.catalog });
  }

  /**
   * Устанавливает ID товара для предпросмотра
   * @param item Объект товара
   */
  setPreview(item: IProduct): void {
    this.preview = item.id;
    this.events.emit('preview:changed', item);
  }

  /**
   * Проверяет, находится ли товар в корзине
   * @param itemId Идентификатор товара
   */
  isInBasket(itemId: string): boolean {
    return this.basket.items.includes(itemId);
  }

  /**
   * Добавляет товар в корзину
   * @param item Объект товара
   */
  addToBasket(item: IProduct): void {
    if (item.price !== null && !this.isInBasket(item.id)) {
      this.basket.items.push(item.id);
      this.updateBasketTotal();
      this.events.emit('basket:changed', this.basket);
    }
  }

  /**
   * Удаляет товар из корзины
   * @param itemId Идентификатор товара
   */
  removeFromBasket(itemId: string): void {
    this.basket.items = this.basket.items.filter(id => id !== itemId);
    this.updateBasketTotal();
    this.events.emit('basket:changed', this.basket);
  }

    /**
   * Очищает корзину
   */
  clearBasket(): void {
    this.basket.items = [];
    this.basket.total = 0;
    // Не забываем очистить и данные заказа связанные с корзиной
    this.order.items = [];
    this.order.total = 0;
    this.events.emit('basket:changed', this.basket);
  }


  /**
   * Обновляет общую сумму корзины
   */
  private updateBasketTotal(): void {
    this.basket.total = this.basket.items.reduce((total, id) => {
      const item = this.catalog.find(product => product.id === id);
      return total + (item?.price || 0);
    }, 0);
    // Обновляем total и в заказе, если он формируется
     this.order.total = this.basket.total;
     this.order.items = this.basket.items; // Синхронизируем товары в заказе
  }

   /**
   * Устанавливает значение поля заказа
   * @param field Поле заказа (ключ из IOrderForm)
   * @param value Значение поля
   */
  setOrderField(field: keyof IOrderForm, value: string): void {
    this.order[field] = value as PaymentMethod; // Приведение типа для payment

    // Запускаем валидацию для обеих форм после изменения любого поля
    this.validateOrderStep1(); // Валидируем первый шаг
    this.validateOrderStep2(); // Валидируем второй шаг
    // Обновляем общее состояние ошибок (может быть пустым, если обе валидации прошли)
    this.events.emit('formErrors:change', this.formErrors);

     // Проверяем готовность всего заказа (все поля заполнены и валидны)
     // Это условие пока не используется, но может пригодиться
    // if (this.order.payment && this.order.address && this.order.email && this.order.phone && Object.keys(this.formErrors).length === 0) {
    //      this.order.total = this.basket.total;
    //      this.order.items = this.basket.items;
    //     this.events.emit('order:ready', this.order);
    // }
  }

   /**
   * Валидирует поля первого шага оформления заказа (оплата и адрес)
   */
  validateOrderStep1(): boolean {
    const errors: IFormErrors = {};
    if (!this.order.payment) {
        // Это условие практически не достижимо, т.к. payment инициализируется и всегда 'card' или 'cash'
        errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if (!this.order.address || this.order.address.trim().length < 5) { // Добавим простую проверку длины адреса
        errors.address = 'Необходимо указать адрес (мин. 5 символов)';
    }
    // Обновляем только ошибки, относящиеся к этому шагу
    this.formErrors = {...this.formErrors, payment: errors.payment, address: errors.address};
    // Удаляем ключи, если ошибок по ним больше нет
    if (!errors.payment) delete this.formErrors.payment;
    if (!errors.address) delete this.formErrors.address;

    return !errors.payment && !errors.address; // Возвращает true, если ошибок на этом шаге нет
  }

  /**
   * Валидирует поля второго шага оформления заказа (email и телефон)
   */
  validateOrderStep2(): boolean {
    const errors: IFormErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Простой примерный формат +7(XXX)XXX-XX-XX или 8(XXX)XXX-XX-XX или просто 11 цифр
    const phoneRegex = /^(\+7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    } else if (!emailRegex.test(this.order.email)) {
        errors.email = 'Некорректный формат email';
    }

    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    } else if (!phoneRegex.test(this.order.phone)) {
        errors.phone = 'Некорректный формат телефона';
    }

    // Обновляем только ошибки, относящиеся к этому шагу
    this.formErrors = {...this.formErrors, email: errors.email, phone: errors.phone};
     // Удаляем ключи, если ошибок по ним больше нет
    if (!errors.email) delete this.formErrors.email;
    if (!errors.phone) delete this.formErrors.phone;

    return !errors.email && !errors.phone; // Возвращает true, если ошибок на этом шаге нет
  }


  /**
   * Возвращает полный объект заказа для отправки на сервер
   */
  getOrder(): IOrder {
    // Убедимся, что items и total актуальны перед отправкой
    this.order.items = this.basket.items;
    this.order.total = this.basket.total;
    return this.order;
  }

  /**
   * Сбрасывает данные заказа и ошибки формы
   */
  clearOrder(): void {
    this.order = {
      payment: 'card', // Сбрасываем на значение по умолчанию
      email: '',
      phone: '',
      address: '',
      items: [], // items/total будут синхронизированы из корзины при необходимости
      total: 0
    };
    this.formErrors = {};
     // Уведомляем об очистке ошибок, чтобы формы обновились
    this.events.emit('formErrors:change', this.formErrors);
  }

}