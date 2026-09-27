/**
 * ЗАДАЧА 1. Абстрактный класс позиции меню.
 *
 * constructor(name, basePrice)
 * - прямое создание через new MenuItem(...) выбрасывает ошибку;
 * - значения записываются через сеттеры, чтобы валидация сработала сразу.
 *
 * Приватные поля: #name, #basePrice.
 *
 * name        геттер и сеттер. Непустая строка, пробелы по краям обрезаются.
 *             Иначе -- Error.
 * basePrice   геттер и сеттер. Конечное число больше 0. Иначе -- Error.
 * price       только геттер. Итоговая цена, в базовом классе равна basePrice.
 *
 * getCategory()  абстрактный метод: выбрасывает ошибку,
 *                если подкласс его не реализовал.
 * describe()     возвращает строку вида «Чизкейк — 250 руб.»
 */

export class MenuItem {
  #name
  #basePrice

  constructor(name, basePrice) {
    if (new.target === MenuItem) {
      throw new Error('Задача 1: класс MenuItem ещё не реализован');
    }

    this.name = name 
    this.basePrice = basePrice
  }

  get name() {
    return this.#name
  }

  set name(value) {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error ('Строка не должна быть пустой!')
    }
    this.#name = value.trim()
  }

  get basePrice() {
    return this.#basePrice
  }

  set basePrice(value) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error ('Конечное число не должно быть 0!')
    }
    this.#basePrice = value
  }

  get price() {
    return this.#basePrice
  }

  get displayName() {
    return this.name
  }

  getCategory() {
    throw new Error(
      `Метод getCategory() не реализован в ${this.constructor.name}`
    );
  }

  describe() {
    return `${this.name} — ${this.price} руб.`
  }

}
