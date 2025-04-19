# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектурный паттерн: MVP

Model-View-Presenter (MVP)

## Описание данных

### IProduct
Интерфейс товара содержит:
- `id` - уникальный идентификатор товара
- `title` - название товара
- `description` - полное описание
- `image` - URL изображения
- `category` - категория товара
- `price` - цена (null если нет в наличии)

### IBasket
Состояние корзины:
- `items` - массив ID товаров
- `total` - общая сумма заказа

### IOrder
Данные заказа:
- `payment` - способ оплаты
- `email` - email покупателя
- `phone` - телефон покупателя
- `address` - адрес доставки
- `items` - массив ID товаров
- `total` - сумма заказа

### IOrderResult
Результат оформления заказа:
- `id` - ID заказа
- `total` - сумма заказа

### IFormErrors
Ошибки формы:
- `email?` - ошибка email
- `phone?` - ошибка телефона
- `address?` - ошибка адреса
- `payment?` - ошибка способа оплаты

### PaymentMethod
Тип способа оплаты:
- `'card'` - оплата картой
- `'cash'` - оплата наличными

## Модели данных

### Класс `AppState`
Центральное хранилище состояния приложения.

**Конструктор:**
```ts
constructor(protected events: IEvents)
```

**Методы:**
- `setCatalog(items: IProduct[])` - установка списка товаров
- `setPreview(item: IProduct)` - установка текущего просматриваемого товара
- `isInBasket(itemId: string)` - проверка наличия товара в корзине
- `addToBasket(item: IProduct)` - добавление товара в корзину
- `removeFromBasket(itemId: string)` - удаление товара из корзины
- `clearBasket()` - очистка корзины
- `setOrderField(field: keyof IOrderForm, value: string)` - установка поля заказа
- `validateOrderStep1()` - валидация первого шага заказа
- `validateOrderStep2()` - валидация второго шага заказа
- `getOrder()` - получение данных заказа

### Класс `WebLarekAPI`
API клиент для работы с сервером.

**Конструктор:**
```ts
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```

**Методы:**
- `getProductList(): Promise<IProduct[]>` - получение списка товаров
- `getProductItem(id: string): Promise<IProduct>` - получение товара по ID
- `orderProducts(order: IOrder): Promise<IOrderResult>` - оформление заказа

## Базовые компоненты

### Класс `Component<T>`
Базовый класс для всех компонентов.

**Конструктор:**
```ts
constructor(container: HTMLElement)
```

**Методы:**
- `toggleClass(className, force)` - переключение класса
- `setText(element, value)` - установка текста
- `setDisabled(element, state)` - блокировка элемента
- `setHidden(element)` / `setVisible(element)` - управление видимостью
- `setImage(element, src, alt)` - установка изображения
- `render(data)` - обновление данных компонента

### Класс `EventEmitter`
Брокер событий.

**Методы:**
- `on(event, callback)` - подписка на событие
- `off(event, callback)` - отписка от события
- `emit(event, data)` - генерация события
- `onAll(callback)` - подписка на все события
- `trigger(event, context)` - создание триггера события

## Компоненты представления

### Класс `Card`

**Конструктор:**
```ts
constructor(container: HTMLElement, actions?: ICardActions)
```

**Свойства и методы:**
- `title`, `price`, `image`, `category` — сеттеры для данных
- `buttonText` — текст кнопки
- `index` — номер в корзине
- `setInBasket(inBasket, price)` — состояние кнопки

### Класс `Basket`

**Конструктор:**
```ts
constructor(container: HTMLElement, events: IEvents)
```

**Свойства:**
- `items` — список товаров в корзине
- `total` — общая сумма

### Класс `Order`

**Конструктор:**
```ts
constructor(container: HTMLFormElement, events: IEvents)
```

**Свойства:**
- `payment`, `address`
- `render(state)`

### Класс `Contacts`

**Конструктор:**
```ts
constructor(container: HTMLFormElement, events: IEvents)
```

**Свойства:**
- `email`, `phone`
- `render(state)`

### Класс `Success`

**Конструктор:**
```ts
constructor(container: HTMLElement, actions: ISuccessActions)
```

**Свойства:**
- `total`

## Система событий

| Событие | Описание |
|--------|----------|
| `items:changed` | Каталог обновлён |
| `card:select` | Выбор товара |
| `preview:changed` | Обновление превью |
| `basket:changed` | Изменение корзины |
| `basket:open` | Открытие корзины |
| `order:start` | Начало оформления |
| `order.submit` | Сабмит формы заказа |
| `contacts.submit` | Сабмит формы контактов |
| `formErrors:change` | Изменение ошибок формы |
| `modal:open` | Открытие модалки |
| `modal:close` | Закрытие модалки |
| `state:cleared` | Очистка состояния приложения |