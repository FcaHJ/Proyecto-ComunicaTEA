import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'

@Injectable({
  providedIn: 'root'
})
export class Cards {
  private _storage: Storage | null = null;
  private STORAGE_KEY = 'cardsData';

  constructor(private storage : Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async setCards(cards : any[]){
    await this._storage?.set(this.STORAGE_KEY, cards);
  }

  async getCards(): Promise<any[]> {
    await this.init(); // asegúrate de que esté listo
    const data = await this._storage?.get(this.STORAGE_KEY);
    return data || [];
  }

  async clearCards(): Promise<void> {
    await this._storage?.remove(this.STORAGE_KEY);
  }
}
