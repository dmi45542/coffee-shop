import { CafeConfig } from '../core/CafeConfig.js';
import { Drink } from '../menu/Drink.js';

// ЗАДАЧА 5. Этот файл и расчёт скидки в Order.js нужно переписать.
// Интерфейс использует только DISCOUNT_OPTIONS и applyDiscount --
// их названия и параметры должны остаться прежними.

export const DISCOUNT_OPTIONS = [
  { value: 'none', label: 'Без скидки' },
  { value: 'loyalty', label: 'Карта лояльности: −10%' },
  { value: 'happyHour', label: 'Счастливые часы: −20% на напитки' },
  { value: 'bigOrder', label: 'Большой заказ: −150 руб. от 5 позиций' },
];

export class NoDiscount {
    calculate(order) {
    return 0
  }
}

export class LoyaltyDiscount {
    calculate(order) {
    const percent = new CafeConfig().get('loyaltyPercent')
    return Math.round((order.subtotal * percent) / 100)
  }
}

export class HappyHourDiscount {
  calculate(order) {
    let drinksSum = 0
    for (const line of order.getLines()) {
      if(line.item instanceof Drink) {
        drinksSum += line.item.price * line.quantity
      }
    }
    const config = new CafeConfig()
    return Math.round((drinksSum * config.get('happyHourPercent')) / 100);
  }
}

export class BigOrderDiscount {
    calculate(order) {
    return order.itemsCount >= 5 ? 150 : 0
  }
}

export function applyDiscount(order, value) {
  switch (value) {
    case 'none': return order.setDiscount(new NoDiscount());
    case 'loyalty': return order.setDiscount(new LoyaltyDiscount());
    case 'happyHour': return order.setDiscount(new HappyHourDiscount());
    case 'bigOrder': return order.setDiscount(new BigOrderDiscount());
    default: throw new Error (`Неизвестный тип скидки!' ${value}`)
  }
}

// Описание решения задачи продублировал из файла Order.js:


// в файле Order.js я убрал иф элсы, поскольку это было неправильным решением и могло привести к тому, что приходилось
// править класс Order, если вдруг допустим была бы задача добавить скидку студентам или прочее. Я 
// и организовал их в паттерне "стратегия" в файле index.js, который включает в себя создание нескольких классов
// под каждый метод, тем самым код стал правильным и визуально понятным.

// использовал паттерн - стратегия

// я выбрал этот паттерн потому что он хорошо заменяет иф елсе, упрощает его как и по моему мнению
// функционально так и становится понятым визуально (всё как по полочкам, по классам)