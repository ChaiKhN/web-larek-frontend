/**
 * Базовый компонент для управления DOM-элементами
 */
export abstract class Component<T> {
  protected readonly container: HTMLElement;

  protected constructor(container: HTMLElement) {
      this.container = container;
  }

  // Переключить класс
  toggleClass(className: string, force?: boolean): void {
      this.container.classList.toggle(className, force);
  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement | null, value: unknown): void {
      if (element) {
          element.textContent = String(value);
      }
  }

  // Сменить статус блокировки
  protected setDisabled(element: HTMLElement | null, state: boolean): void {
      if (element) {
          if (state) element.setAttribute('disabled', 'true');
          else element.removeAttribute('disabled');
      }
  }

  // Сделать элемент видимым/скрытым
  protected setHidden(element: HTMLElement | null): void {
      if(element) element.style.display = 'none';
  }

  protected setVisible(element: HTMLElement | null): void {
     if(element) element.style.removeProperty('display');
  }

  // Установить изображение с алтернативным текстом
  protected setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
      if (element) {
          element.src = src;
          if (alt) {
              element.alt = alt;
          }
      }
  }

  // Базовый метод рендера, обновляет данные и возвращает контейнер
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}