import './scss/styles.scss';
import { AppState } from './components/base/AppState';
// import { Api } from './components/base/api'; // Базовый класс больше не нужен напрямую
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI'; // Используем наш расширенный API класс
import { Page } from './components/Page';
import { Card } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';
import {
  IProduct, IBasket, IOrderForm, IOrderResult, IFormErrors, ApiListResponse
} from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// --- Инициализация основных модулей ---
const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL); // Используем наш класс API
const appState = new AppState(events);

// --- Получение ссылок на шаблоны ---
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order'); // Шаблон для Шага 1
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Шаблон для Шага 2
const modalContainer = ensureElement<HTMLElement>('#modal-container'); // Контейнер модалки

// --- Инициализация Компонентов (теперь импортированных) ---
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
// Создаем компоненты, передавая им клонированные шаблоны и события
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderStep1Form = new Order(cloneTemplate(orderTemplate), events);
const orderStep2Form = new Contacts(cloneTemplate(contactsTemplate), events);

// --- Связывание событий (остается таким же по логике) ---

// Отладка: Логирование всех событий
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Открытие/закрытие модалки -> Блокировка страницы
events.on('modal:open', () => {
    page.locked = true;
});
events.on('modal:close', () => {
    page.locked = false;
});

// Получение списка товаров с сервера -> Установка в AppState
api.getProductList()
    .then((items) => {
        appState.setCatalog(items);
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
    });

// Изменение каталога в AppState -> Перерисовка каталога на странице
events.on('items:changed', (data: { catalog: IProduct[] }) => {
    page.catalog = data.catalog.map(itemData => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', itemData)
        });
        return card.render(itemData);
    });
});

// Выбор карточки -> Установка preview в AppState
events.on('card:select', (item: IProduct) => {
    appState.setPreview(item);
});

// Изменение preview -> Открытие модалки с детальной карточкой
events.on('preview:changed', (item: IProduct) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            // Обработка клика на кнопку "В корзину" / "Убрать"
            if (appState.isInBasket(item.id)) {
                appState.removeFromBasket(item.id);
            } else {
                appState.addToBasket(item);
            }
             // Обновляем состояние кнопки в этой же карточке (синхронно)
             card.setInBasket(appState.isInBasket(item.id), item.price);
             // Счетчик в хедере обновится через событие 'basket:changed'
        }
    });
    // Устанавливаем начальное состояние кнопки при открытии
    card.setInBasket(appState.isInBasket(item.id), item.price);
    // Рендерим карточку и показываем в модалке
    modal.render({ content: card.render(item) });
    modal.open();
});

// Изменение корзины -> Обновление счетчика и компонента корзины
events.on('basket:changed', (basketData: IBasket) => {
    page.counter = basketData.items.length; // Обновляем счетчик в хедере

    // Обновляем содержимое компонента корзины
    const basketItems = basketData.items.map((itemId, index) => {
        const item = appState.catalog.find(prod => prod.id === itemId);
        if (!item) return null;

        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => appState.removeFromBasket(itemId) // Клик на кнопку удаления
        });
        // Устанавливаем номер п/п
        card.index = index + 1;
        return card.render(item);
    }).filter(Boolean) as HTMLElement[]; // Убираем null элементы

    basket.items = basketItems;
    basket.total = basketData.total;
});

// Открытие корзины -> Рендер компонента корзины в модалке
events.on('basket:open', () => {
     // Перед открытием убедимся, что данные корзины отрисованы актуально
    events.emit('basket:changed', appState.basket); // Триггерим обновление basket компонента
    modal.render({ content: basket.render() }); // Рендерим Basket компонент
    modal.open();
});

// Начало оформления заказа -> Открытие модалки с формой шага 1
events.on('order:start', () => {
    appState.clearOrder(); // Сбрасываем данные предыдущего заказа
    modal.render({
        content: orderStep1Form.render({
            payment: appState.order.payment,
            address: appState.order.address,
            valid: false, // Шаг 1 невалиден изначально
            errors: []
        })
    });
    modal.open();
});

// Изменение полей формы шага 1 -> Обновление состояния и валидация
events.on(/^order\.(payment|address):change$/, (data: { field: keyof IOrderForm, value: string }) => {
    appState.setOrderField(data.field, data.value);
    // Валидация и обновление ошибок произойдут внутри AppState и вызовут formErrors:change
});

// Отправка формы шага 1 -> Открытие модалки с формой шага 2
events.on('order:submit', () => {
    // Проверяем валидность шага 1 перед переходом
    if (appState.validateOrderStep1()) {
        modal.render({
            content: orderStep2Form.render({
                email: appState.order.email,
                phone: appState.order.phone,
                valid: false, // Шаг 2 тоже изначально невалиден
                errors: []
            })
        });
        // Модалка уже открыта, только меняем контент
    }
    // Если не валидно, событие formErrors:change уже обновило ошибки в UI
});

// Изменение полей формы шага 2 -> Обновление состояния и валидация
events.on(/^contacts\.(email|phone):change$/, (data: { field: keyof IOrderForm, value: string }) => {
    appState.setOrderField(data.field, data.value);
     // Валидация и обновление ошибок произойдут внутри AppState и вызовут formErrors:change
});

// Изменение ошибок формы -> Обновление UI обеих форм
events.on('formErrors:change', (errors: IFormErrors) => {
    // Определяем валидность каждого шага на основе ТЕКУЩИХ ошибок
     const step1Valid = !errors.payment && !errors.address;
     orderStep1Form.render({ valid: step1Valid, errors: Object.values(errors) });

     const step2Valid = !errors.email && !errors.phone;
     orderStep2Form.render({ valid: step2Valid, errors: Object.values(errors) });
});

// Отправка формы шага 2 -> Отправка заказа на сервер
events.on('contacts:submit', () => {
    // Финальная валидация всего заказа перед отправкой
    if (appState.validateOrderStep1() && appState.validateOrderStep2()) {
        const orderData = appState.getOrder();

        api.orderProducts(orderData)
            .then((result: IOrderResult) => {
                // Успешно! Показываем Success
                const success = new Success(cloneTemplate(successTemplate), {
                    onClick: () => {
                        modal.close(); // Закрываем модалку успеха
                         // Очищаем состояние заказа и корзину после успешной отправки
                        appState.clearBasket(); // Это также вызовет basket:changed -> обновит счетчик
                        // appState.clearOrder(); // Очистка заказа не нужна, т.к. он сбрасывается при order:start
                    }
                });
                modal.render({ content: success.render({ total: result.total }) });
                // Модалка уже открыта
            })
            .catch(err => {
                console.error('Ошибка отправки заказа:', err);
                // Отображаем ошибку пользователю в контейнере ошибок формы 2
                orderStep2Form.errors = ['Ошибка отправки заказа. Попробуйте еще раз.'];
            });
    } else {
         console.warn('Попытка отправить невалидный заказ');
         // Обновляем ошибки в UI на всякий случай
         events.emit('formErrors:change', appState.formErrors);
    }
});

// --- Инициализация ---
// При загрузке страницы корзина пуста, обновляем счетчик (на всякий случай)
page.counter = appState.basket.items.length; // Будет 0