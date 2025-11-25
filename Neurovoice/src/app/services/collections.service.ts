import { Injectable } from '@angular/core';
import { CardApiService } from './cards.api.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  constructor(private api: CardApiService) {}

  getCollections() { return this.api.getCollections(); }
  getCollectionById(id: number) { return this.api.getCollectionById(id); }
  createCollection(col: any) { return this.api.createCollection(col); }
  updateCollection(id: number, col: any) { return this.api.updateCollection(id, col); }
  deleteCollection(id: number) { return this.api.deleteCollection(id); }
  addCardToCollection(collectionId: number, cardId: number) { return this.api.addCardToCollection(collectionId, cardId); }
  removeCardFromCollection(collectionId: number, cardId: number) { return this.api.removeCardFromCollection(collectionId, cardId); }
}

