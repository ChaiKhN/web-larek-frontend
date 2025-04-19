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
  /** Добавлен ли товар в корзину (для UI) */
  inBasket?: boolean;
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
 * Данные заказа - полные
 */
export interface IOrder extends IOrderForm {
  /** Массив идентификаторов товаров */
  items: string[];
  /** Сумма заказа */
  total: number;
}

/**
 * Данные формы заказа (поля для заполнения)
 */
export interface IOrderForm {
    /** Способ оплаты */
    payment: PaymentMethod;
    /** Email покупателя */
    email: string;
    /** Телефон покупателя */
    phone: string;
    /** Адрес доставки */
    address: string;
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
 * Ошибки формы заказа (ключи соответствуют IOrderForm)
 */
export type IFormErrors = Partial<Record<keyof IOrderForm, string>>;


/**
 * Интерфейс системы событий
 */
export interface IEvents {
  /**
   * Подписаться на событие
   * @param event Имя события или регулярное выражение
   * @param callback Функция-обработчик
   */
  on<T extends object>(event: string | RegExp, callback: (data: T) => void): void;
  /**
   * Сгенерировать событие
   * @param event Имя события
   * @param data Данные события
   */
  emit<T extends object>(event: string, data?: T): void;
   /**
    * Вернуть триггер для события
    * @param event Имя события
    * @param context Дополнительные данные для события
    */
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

// --- Дополнительные типы для UI ---

/** Данные для отображения в модальном окне */
export interface IModalData {
  content: HTMLElement;
}

/** Состояние главной страницы */
export interface IPage {
	counter: number; // Счетчик товаров в корзине
	catalog: HTMLElement[]; // Элементы каталога
	locked: boolean; // Блокировка прокрутки
}

/** Общее состояние формы (валидность и ошибки) */
export interface IFormState {
	valid: boolean;
	errors: string[];
}

/** Действия для карточки */
export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

/** Данные для компонента успеха */
export interface ISuccess {
    total: number;
}

/** Действия для компонента успеха */
export interface ISuccessActions {
    onClick: () => void;
}

// --- Типы для API ---
/** Ответ API со списком */
export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

/** HTTP методы для POST запросов */
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';