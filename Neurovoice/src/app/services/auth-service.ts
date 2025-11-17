import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexeddb.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private loggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());
   currentUser$ = this.loggedIn$.asObservable();

  constructor(private db: IndexedDBService) {
    this.loadInitialUsers();

    const saved = localStorage.getItem('loggedUser');
    if (saved) this.loggedIn$.next(JSON.parse(saved));
  }

  get isLoggedIn$() {
    return this.loggedIn$.asObservable();
  }

  private async loadInitialUsers() {
    const users = await this.db.getUsers();
    if (!users || users.length === 0) {
      const data = await fetch('assets/users.json').then(res => res.json());
      await this.db.setUsers(data);
      console.log('Usuarios iniciales cargados.');
    }
  }

  async login(username: string, password: string): Promise<any> {
    const users = await this.db.getUsers();

    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
      console.log("Usuario logeado correctamente: ",user );
      this.loggedIn$.next(true);

      return user;
    }
    return null;
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
