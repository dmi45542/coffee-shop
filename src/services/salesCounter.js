import { Order } from '../order/Order.js';

/**
 * ЗАДАЧА 3.2. Подписчик: счётчик продаж.
 *
 * createSalesCounter(orderService) подписывается на события сервиса
 * и считает, сколько штук каждой позиции продано. Ключ -- item.name.
 *
 * - 'orderCreated'  -- прибавить количество по каждой строке заказа;
 * - 'statusChanged' со статусом 'cancelled' -- вычесть их обратно.
 *
 * Возвращает объект:
 *   getCount(name)    сколько продано позиции (0, если не продавалась);
 *   getTop(limit = 3) массив { name, count }, отсортированный по убыванию count;
 *   unsubscribe()     отписаться от обоих событий.
 *
 * Подсказка: on() у EventEmitter возвращает функцию отписки.
 */

export function createSalesCounter(orderService) {
  const counts = new Map()
  
  const offCreated = orderService.on('orderCreated', ({ order }) => {
    for (const line of order.getLines()) {
      const {item, quantity} = line;
      counts.set(item.name, (counts.get(item.name) ?? 0) + quantity);
    }
  });

  const offStatusChanged = orderService.on('statusChanged', ({order, to}) => {
    if (to !== 'cancelled') {
      return
    }

    for (const line of order.getLines()) {
      const {item, quantity} = line;
      counts.set(item.name, (counts.get(item.name) ?? 0) - quantity);
    }
  })

  return {
    getCount(name) {
      return counts.get(name) ?? 0
    },

    getTop(limit = 3) {
      return [...counts] // спред оператор создаёт копию и с ней можно работать как с копией массива чтобы не повредить оригинал
        .map(([name, count]) => ({name, count}))
        .sort((a, b) => b.count - a.count) // отсортировать по убыванию
        .slice(0, limit) // первые лимит
    },

    unsubscribe() {
      offCreated()
      offStatusChanged()
    }
  }
}