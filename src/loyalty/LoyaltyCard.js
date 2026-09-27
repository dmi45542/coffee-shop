// ЗАДАЧА 7. Код работает, но его нужно переписать. Подробности в TASK.md.
// Публичные методы addPoints, spendPoints, getLevel должны остаться.

export class LoyaltyCard {
  #points
  #history

  constructor(ownerName) {
    this.ownerName = ownerName;
    this.#points = 0;
    this.#history = [];
  }

  get points() {
    return this.#points
  }

    getHistory() {
      return this.#history.map(entry => ({ ...entry }))
    }

  // 1 балл за каждые полные 100 руб. заказа
    addPoints(orderTotal) {
      const earned = Math.floor(orderTotal / 100);
      this.#points += earned;
      this.#history.push({ type: 'earn', amount: earned });
      return earned;
    };

    spendPoints(amount) {
      if (!Number.isInteger(amount) || amount <= 0) {
        throw new Error('Количество должно быть целым положительным числом!');
      }
      if (amount > this.#points) {
        throw new Error('Недостаточно баллов!');
      }
      this.#points -= amount;
      this.#history.push({ type: 'spend', amount });
    };

    getLevel() {
      if (this.#points >= 500) return 'Золото';
      if (this.#points >= 100) return 'Серебро';
      return 'Бронза';
    };
}

// Основной принцип здесь инкапсуляция, но какого то большого влияния от паттернов или принципов здесь нет, 
// здесь буквально всё по заданию как было написано, прям пошагово

// Так же добавил проверку иф елсе в sendPoints, чтобы была отдельно проверка на положительное число
// и на достаточно ли баллов у пользователя 

// Так же я сделал приватные поля истории и баллов, чтобы их нельзя было мнять и "накручивать" себе баллы
