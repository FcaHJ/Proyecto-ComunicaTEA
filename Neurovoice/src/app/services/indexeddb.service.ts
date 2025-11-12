import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IndexedDBService {

  private dbName = 'CardsDB';

  constructor() {
    this.openDB();
  }

  private openDB() {
    const request = indexedDB.open(this.dbName, 3); // versión 2

    request.onupgradeneeded = () => {
      const db = request.result;

      // CARTAS
      if (!db.objectStoreNames.contains('cards')) {
        db.createObjectStore('cards', { keyPath: 'id' });
      }

      // COLECCIONES
      if (!db.objectStoreNames.contains('collections')) {
        db.createObjectStore('collections', { keyPath: 'id' });
      }

      //USUARIOS
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id' });
      }
    };
  }

  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // =========================
  //  CARTAS
  // =========================

  async getCards(): Promise<any[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cards'], 'readonly');
      const store = tx.objectStore('cards');
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async setCards(cards: any[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cards'], 'readwrite');
      const store = tx.objectStore('cards');

      cards.forEach(c => store.put(c));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async replaceAllCards(cards: any[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cards'], 'readwrite');
      const store = tx.objectStore('cards');
      store.clear(); // Limpia todo
      cards.forEach(card => store.put(card)); // Inserta las nuevas 50
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

    async getUsers(): Promise<any[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['users'], 'readonly');
      const store = tx.objectStore('users');
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async setUsers(users: any[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['users'], 'readwrite');
      const store = tx.objectStore('users');

      users.forEach(c => store.put(c));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }


  async replaceAllUsers(users: any[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['users'], 'readwrite');
      const store = tx.objectStore('users');
      store.clear(); // borra los anteriores
      users.forEach(u => store.put(u));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cards'], 'readwrite');
      const store = tx.objectStore('cards');
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getCardById(id: number | string): Promise<any> {
    const db = await this.getDB(); 
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cards'], 'readonly');
      const store = tx.objectStore('cards');
      const req = store.get(id);

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }


  // =========================
  //  COLECCIONES
  // =========================

  async getCollections(): Promise<any[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['collections'], 'readonly');
      const store = tx.objectStore('collections');
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async setCollections(collections: any[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['collections'], 'readwrite');
      const store = tx.objectStore('collections');

      collections.forEach(col => store.put(col));

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

}

