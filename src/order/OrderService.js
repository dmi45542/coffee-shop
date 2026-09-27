import { EventEmitter } from '../core/EventEmitter.js';
import { Logger } from '../core/Logger.js';
import { Order } from './Order.js';
import { TRANSITIONS, ORDER_STATUS_LABELS } from './statuses.js';

/**
 * ЗАДАЧА 3.1. Сервис заказов.
 *
 * Класс наследует EventEmitter, а к его прототипу подключён миксин Logger
 * (строка подключения уже есть внизу файла).
 *
 * Заказы хранятся в приватном поле. Структуру выберите сами,
 * удобно использовать Map: id заказа -> { order, status }.
 *
 * createOrder(order)
 *   - order должен быть экземпляром Order, иначе Error;
 *   - пустой заказ (itemsCount === 0) оформить нельзя -- Error;
 *   - один и тот же заказ нельзя оформить дважды -- Error;
 *   - статус нового заказа -- 'new';
 *   - генерирует событие 'orderCreated' с данными { order };
 *   - пишет в лог через this.log(...).
 *
 * changeStatus(orderId, nextStatus)
 *   - неизвестный заказ -- Error;
 *   - переход, которого нет в TRANSITIONS, -- Error, статус не меняется;
 *   - генерирует 'statusChanged' с данными { order, from, to };
 *   - пишет в лог.
 *
 * getStatus(orderId)  статус заказа или null, если заказа нет.
 * getOrders()         массив объектов { order, status }.
 *                     Изменение этого массива не должно влиять на сервис.
 */
export class OrderService extends EventEmitter {
  #orders = new Map()

  createOrder(order) {
    if (!(order instanceof Order)) {
      throw new Error ('order должен быть экземпляром Order!')
    }

    if (order.itemsCount === 0) {
      throw new Error ('пусой заказ оформить нельзя!')
    }

    for (const item of this.#orders.values()) {
      if (item.order === order) {
        throw new Error ('Заказ уже оформлен!')
      }
    }

    this.#orders.set(order.id, {order, status: 'new'})

    this.emit('orderCreated', {order})
    this.log(`Создан заказ ${order.id}`)
    return order.id
}

  changeStatus(orderId, nextStatus) {
    const entry = this.#orders.get(orderId)
    if (!entry) {
      throw new Error (`Заказа нет или он неизвестен: ${orderId}`)
    }

    if (!TRANSITIONS[entry.status]?.includes(nextStatus)) {
      throw new Error ('Нельзя так')
    }

    const from = entry.status
    entry.status = nextStatus
    this.emit('statusChanged', { 
      order: entry.order, 
      from, 
      to: nextStatus 
    });

    this.log(`Заказ #${orderId}: ${from} → ${nextStatus}`);

  }

  getStatus(orderId) {
    return this.#orders.get(orderId)?.status ?? null
  }

  getOrders() {
    return [...this.#orders.values()]
  }
}

Object.assign(OrderService.prototype, Logger);
