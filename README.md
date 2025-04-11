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
```typescript
constructor(protected events: IEvents)
```
- `events` - брокер событий

**Методы:**
- `clearState()` - полный сброс состояния
- `setItems(items: IProduct[])` - установка списка товаров
- `addToBasket(item: IProduct)` - добавление товара в корзину
- `removeFromBasket(itemId: string)` - удаление товара из корзины

### Класс `WebLarekApi`
API клиент для работы с сервером.

**Конструктор:**
```typescript
constructor(private baseUrl: string, private cdnUrl: string)
```
- `baseUrl` - базовый URL API
- `cdnUrl` - URL CDN для изображений

**Методы:**
- `getProductList(): Promise<IProduct[]>` - получение списка товаров
- `createOrder(order: IOrder): Promise<IOrderResult>` - оформление заказа

## Базовые компоненты

### Класс `Component<T>`
Базовый класс для всех компонентов.

**Конструктор:**
```typescript
constructor(protected container: HTMLElement)
```
- `container` - родительский DOM-элемент

**Методы:**
- `setText(element: HTMLElement, value: unknown)` - установка текста
- `setImage(element: HTMLImageElement, src: string, alt: string)` - установка изображения
- `setDisabled(element: HTMLElement, state: boolean)` - блокировка элемента

### Класс `EventEmitter`
Брокер событий (реализует паттерн Наблюдатель).

**Конструктор:**
```typescript
constructor()
```

**Методы:**
- `on(event: string, callback: Function)` - подписка на событие
- `emit(event: string, ...args: unknown[])` - генерация события

## Компоненты представления

### Класс `Card`
Компонент карточки товара.

**Конструктор:**
```typescript
constructor(container: HTMLElement)
```
- `container` - DOM-элемент карточки

**Свойства:**
- `price` - сеттер для установки цены (блокирует кнопку если цена null)

### Класс `Basket`
Компонент корзины товаров.

**Конструктор:**
```typescript
constructor(container: HTMLElement, events: EventEmitter)
```
- `container` - DOM-элемент корзины
- `events` - брокер событий

**Методы:**
- `render()` - отрисовка содержимого корзины

### Класс `Order`
Компонент формы заказа.

**Конструктор:**
```typescript
constructor(container: HTMLFormElement, events: EventEmitter)
```
- `container` - форма заказа
- `events` - брокер событий

**Свойства:**
- `address` - сеттер для установки адреса

## Система событий

| Событие | Описание |
|---------|----------|
| `items:changed` | Изменение списка товаров |
| `basket:changed` | Изменение содержимого корзины |
| `order:open` | Открытие формы заказа |
| `order:submit` | Отправка заказа |
| `modal:open` | Открытие модального окна |
| `modal:close` | Закрытие модального окна |
| `state:cleared` | Сброс состояния приложения |