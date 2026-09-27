import { CafeConfig } from '../core/CafeConfig.js';

// ЗАДАЧА 6. Код работает, но его нужно переписать. Подробности в TASK.md.

const SEPARATOR = '------------------------';

export class ReceiptPrinter {
  print(order) {
    const config = new CafeConfig();

    const lines = order.getLines().map(({ item, quantity }) => {
      let title = item.displayName

      return `${title} x${quantity} = ${item.price * quantity} руб.`;
    });

    return [
      config.get('cafeName'),
      `Заказ #${order.id}`,
      SEPARATOR,
      ...lines,
      SEPARATOR,
      `Сумма: ${order.subtotal} руб.`,
      `Скидка: ${order.discount} руб.`,
      `Итого: ${order.total} руб.`,
    ].join('\n');
  }
}


// я использовал принцип ООП - полиморфизм - у всех классов есть общий какой то геттер
// в нашем случае это displayName
// Я добавил этот геттер в файлы - MenuItem.js, Drink.js и Dessert.js. А попадают эти геттеры в файл
// ReceiptPrinter с помощью наследования
// если бы я не исправил эту проблему, то при появлении нового продукта, то каждый раз пришлось бы 
// перезаписывать код и добавлять всё больше и больше информации в принтер, а это нам не надо поскольку это только усложняет код и делает его больше и не
// не понятнее для глаз тех, кто будет в будущем этот код просматривать 

