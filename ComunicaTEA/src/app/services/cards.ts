import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'

@Injectable({
  providedIn: 'root'
})
export class Cards {
  private _storage: Storage | null = null;

  constructor(private storage : Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  async setCards(cards : any[]){
    await this._storage?.set('cards', cards)
  }

  async getCards(): Promise<any[]> {
    return (await this._storage?.get('cards')) || [];
  }
}
