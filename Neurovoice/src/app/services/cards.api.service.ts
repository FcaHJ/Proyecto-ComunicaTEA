import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardApiService {

  private API_URL = 'http://localhost:5000/api';


  constructor(private http: HttpClient) {}

  // ============================
  // 🔹 COLECCIONES
  // ============================
  getCollections() {
    return firstValueFrom(this.http.get<any[]>(`${this.API_URL}/collections`));
  }

  getCollectionById(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.API_URL}/collections/${id}`));
  }

  removeCardFromCollection(collectionId: number, cardId: number) {
    return firstValueFrom(
      this.http.delete(`${this.API_URL}/collections/${collectionId}/cards/${cardId}`)
    );
  }

  deleteCollection(id: number | string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  setCollection(id: number, data: any) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // ============================
  // 🔹 CARTAS
  // ============================
  getCards() {
    return firstValueFrom(this.http.get<any[]>(`${this.API_URL}/cards`));
  }

  getCardById(id: number) {
    return firstValueFrom(this.http.get<any>(`${this.API_URL}/cards/${id}`));
  }

  addCard(card: any) {
    return firstValueFrom(this.http.post(`${this.API_URL}/cards`, card));
  }

  deleteCard(id: number) {
    return firstValueFrom(this.http.delete(`${this.API_URL}/cards/${id}`));
  }

  setCard(id: number, data: any) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }
}

