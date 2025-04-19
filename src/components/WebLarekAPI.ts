import { Api, ApiListResponse, ApiPostMethods } from './base/api';
import { IOrder, IOrderResult, IProduct } from '../types';

/**
 * Интерфейс для API веб-ларька
 */
export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

/**
 * Класс для работы с API веб-ларька, расширяет базовый Api
 */
export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    /**
     * Получить список всех продуктов
     */
    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            // Добавляем полный URL к изображениям
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }

    /**
     * Получить детальную информацию о продукте по ID
     * (В текущей реализации не используется, но может понадобиться)
     */
    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image, // Добавляем полный URL
        }));
    }

    /**
     * Отправить данные заказа
     */
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data);
    }
}