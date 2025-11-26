import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexeddb.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private API_URL = 'http://localhost:5000/api/users';

   private loggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());
   currentUser$ = this.loggedIn$.asObservable();

  constructor(private http: HttpClient) {

    const saved = localStorage.getItem('loggedUser');
    if (saved) this.loggedIn$.next(true);
  }

  get isLoggedIn$() {
    return this.loggedIn$.asObservable();
  }


  login(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.API_URL}/login`, { username, password })
        .subscribe({
          next: (user: any) => {
            localStorage.setItem('loggedUser', JSON.stringify(user));
            this.loggedIn$.next(true);
            resolve(user);
          },
          error: (err) => {
            console.error('Error de login:', err);
            resolve(null);
          }
        });
    });
  }

  register(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.API_URL}/register`, { username, password })
        .subscribe({
          next: (user: any) => resolve(user),
          error: (err) => resolve(null)
        });
    });
  }

  logout() {
    localStorage.removeItem('loggedUser');
    this.loggedIn$.next(false);
  }

  getCurrentUser() {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedUser');
  }
}
