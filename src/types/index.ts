export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
  }
  
  export interface IBasket {
    items: string[];
    total: number;
  }
  
  export interface IOrder {
    payment: 'card' | 'cash';
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;
  }
  
  export interface IOrderResult {
    id: string;
    total: number;
  }
  
  export interface IFormState {
    valid: boolean;
    errors: string[];
  }
  
  export interface ICardActions {
    onClick: (event: MouseEvent) => void;
  }
  
  export interface ISuccessActions {
    onClick: () => void;
  }
  
  export interface IModalData {
    content: HTMLElement;
  }