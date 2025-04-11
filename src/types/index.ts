/**
 * Типы данных приложения
 */

/** 
 * Товар в каталоге 
 */
export interface IProduct {
  /** Уникальный идентификатор товара */
  id: string;
  /** Название товара */
  title: string;
  /** Полное описание товара */
  description: string;
  /** URL изображения товара */
  image: string;
  /** Категория товара */
  category: string;
  /** Цена товара (null если нет в наличии) */
  price: number | null;
}

/**
 * Состояние корзины
 */
export interface IBasket {
  /** Массив идентификаторов товаров в корзине */
  items: string[];
  /** Общая сумма заказа */
  total: number;
}

/** 
 * Способ оплаты 
 */
export type PaymentMethod = 'card' | 'cash';

/**
 * Данные заказа
 */
export interface IOrder {
  /** Способ оплаты */
  payment: PaymentMethod;
  /** Email покупателя */
  email: string;
  /** Телефон покупателя */
  phone: string;
  /** Адрес доставки */
  address: string;
  /** Массив идентификаторов товаров */
  items: string[];
  /** Сумма заказа */
  total: number;
}

/**
 * Результат оформления заказа
 */
export interface IOrderResult {
  /** Идентификатор заказа */
  id: string;
  /** Сумма заказа */
  total: number;
}

/**
 * Ошибки формы
 */
export interface IFormErrors {
  /** Ошибка поля email */
  email?: string;
  /** Ошибка поля телефон */
  phone?: string;
  /** Ошибка поля адрес */
  address?: string;
  /** Общая ошибка формы */
  payment?: string;
}

/**
 * Интерфейс системы событий
 */
export interface IEvents {
  /**
   * Подписаться на событие
   * @param event Имя события
   * @param callback Функция-обработчик
   */
  on(event: string, callback: Function): void;
  
  /**
   * Сгенерировать событие
   * @param event Имя события
   * @param data Данные события
   */
  emit(event: string, data?: unknown): void;
}