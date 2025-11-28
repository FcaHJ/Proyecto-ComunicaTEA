import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Si quieres usar environment, importa: import { environment } from '../../environments/environment';
// y usa: private baseUrl = environment.apiUrl + '/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Cambia aquí según donde corras Flask:
  // En desarrollo en el mismo PC: 'http://127.0.0.1:5000/api'
  // En emulador Android: 'http://10.0.2.2:5000/api'
  // En dispositivo real (mismo wifi): 'http://192.168.X.Y:5000/api'
  private baseUrl = environment.apiUrl + '/api';

  constructor(private http: HttpClient) {}

  private handleError(err: any) {
    console.error('API Error', err);
    return throwError(() => err);
  }

  // CARDS
  getCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/cards/`).pipe(catchError(this.handleError));
  }

  getCard(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cards/${id}`).pipe(catchError(this.handleError));
  }

  createCard(card: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cards/`, card).pipe(catchError(this.handleError));
  }

  updateCard(id: number, card: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/cards/${id}`, card).pipe(catchError(this.handleError));
  }

  deleteCard(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cards/${id}`).pipe(catchError(this.handleError));
  }

  toggleFavorite(cardId: number, fav: boolean) {
    return this.http.put(`${this.baseUrl}/cards/${cardId}/fav`, { fav });
  }


  // COLLECTIONS
  getCollections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/collections/`).pipe(catchError(this.handleError));
  }

  createCollection(collection: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/collections/`, collection).pipe(catchError(this.handleError));
  }

  updateCollection(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/collections/${id}`, data).pipe(catchError(this.handleError));
  }

  deleteCollection(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/collections/${id}`).pipe(catchError(this.handleError));
  }

  getCollection(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/collections/${id}`);
  }

  addCardToCollection(collectionId: number, cardId: number, position: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/collections/${collectionId}/add/${cardId}`, {});
  }

  removeCardFromCollection(collectionId: number, cardId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/collections/${collectionId}/cards/${cardId}`);
  }


  // USERS / AUTH
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/register`, user).pipe(catchError(this.handleError));
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/login`, { username, password }).pipe(catchError(this.handleError));
  }
}

