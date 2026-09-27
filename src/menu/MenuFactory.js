/**
 * ЗАДАЧА 2. Фабрика позиций меню.
 *
 * static create(type, data)
 *   'drink'   -> new Drink(data.name, data.price, data.size)
 *   'dessert' -> new Dessert(data.name, data.price, data.isVegan)
 *   любой другой тип -> Error с текстом «Неизвестный тип позиции: <type>»
 *
 * static createMenu(list)
 *   принимает массив объектов из src/data/menu.js
 *   и возвращает массив готовых позиций меню.
 */

import { Drink } from './Drink.js';
import { Dessert } from './Dessert.js';

export class MenuFactory {
  static create(type, data) {
    switch (type) {
      case 'drink': 
        return new Drink(data.name, data.price, data.size)
      case 'dessert':
        return new Dessert(data.name, data.price, data.isVegan)
      default:
        throw new Error (`Неизвестный тип позиции: ${type}`)
    }
  }

static createMenu(list) {
    return list.map((item) => MenuFactory.create(item.type, item));
  }
}
