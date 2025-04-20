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

export type PaymentMethod = 'card' | 'cash';

export interface IOrderForm {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type IFormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IEvents {
    on<T extends object>(event: string | RegExp, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
    total: number;
}

export interface ISuccessActions {
    onClick: () => void;
}

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';