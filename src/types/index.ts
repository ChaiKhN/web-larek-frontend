// Модель товара
export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
  }
 
// Состояние корзины
  export interface IBasket {
    items: string[];
    total: number;
  }

// Данные заказа
  export interface IOrder {
    payment: 'card' | 'cash';
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;
  }

// Результат оформления заказа 
  export interface IOrderResult {
    id: string;
    total: number;
  }
 
// Состояние формы
  export interface IFormState {
    valid: boolean;
    errors: string[];
  }

/**
 * Дополнительные типы для компонентов
 */
  export interface ICardActions {
    onClick: (event: MouseEvent) => void;
  }
  
  export interface ISuccessActions {
    onClick: () => void;
  }
 
// Тип для данных модального окна
  export interface IModalData {
    content: HTMLElement;
  }