import { CafeConfig } from '../core/CafeConfig.js';
import { NoDiscount } from '../discounts/index.js';
import { MenuItem } from '../menu/MenuItem.js';

// Заказ -- пример композиции: он не наследует позиции меню, а хранит их.
// Класс готов, кроме расчёта скидки -- его нужно переписать в задаче 5.
export class Order {
  static #nextId = 1;

  #id;
  #lines = [];
  #discount = new NoDiscount()

  constructor() {
    this.#id = Order.#nextId++;
  }

  get id() {
    return this.#id;
  }

  setDiscount(strategy) {
    this.#discount = strategy
  }

  addItem(item, quantity = 1) {
    if (!(item instanceof MenuItem)) {
      throw new Error('В заказ можно добавить только позицию меню');
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Количество должно быть целым положительным числом');
    }

    const limit = new CafeConfig().get('maxItemsPerOrder');
    if (this.itemsCount + quantity > limit) {
      throw new Error(`В заказе не может быть больше ${limit} позиций`);
    }

    const line = this.#lines.find(l => l.item === item);
    if (line) {
      line.quantity += quantity;
    } else {
      this.#lines.push({ item, quantity });
    }
  }

  removeItem(item) {
    this.#lines = this.#lines.filter(line => line.item !== item);
  }

  getLines() {
    return this.#lines.map(line => ({ ...line }));
  }

  get itemsCount() {
    return this.#lines.reduce((sum, line) => sum + line.quantity, 0);
  }

  get subtotal() {
    return this.#lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  }

  get discount() {
    return Math.min(this.#discount.calculate(this), this.subtotal);
  }

  get total() {
    return this.subtotal - this.discount;
  }
}

// в данном файле я убрал иф элсы, поскольку это было неправильным решением и могло привести к тому, что приходилось
// править класс Order, если вдруг допустим была бы задача добавить скидку студентам или прочее. Я 
// и организовал их в паттерне "стратегия" в файле index.js, который включает в себя создание нескольких классов
// под каждый метод, тем самым код стал правильным и визуально понятным.

// использовал паттерн - стратегия

// я выбрал этот паттерн потому что он хорошо заменяет иф елсе, упрощает его как и по моему мнению
// функционально так и становится понятым визуально (всё как по полочкам, по классам)