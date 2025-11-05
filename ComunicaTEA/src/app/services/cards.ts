import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexeddb.service';

@Injectable({ providedIn: 'root' })
export class Cards {

  constructor(private db: IndexedDBService) {}

  getCards() {
    return this.db.getCards();
  }

  setCards(cards: any[]) {
    return this.db.setCards(cards);
  }

  clearCards() {
    return this.db.clear();
  }
}
