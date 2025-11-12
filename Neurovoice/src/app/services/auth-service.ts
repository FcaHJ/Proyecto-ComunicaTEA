import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private db: IndexedDBService) {
    this.loadInitialUsers();
  }

  private async loadInitialUsers() {
    const users = await this.db.getUsers();
    if (!users || users.length === 0) {
      const data = await fetch('assets/users.json').then(res => res.json());
      await this.db.setUsers(data);
      console.log('Usuarios iniciales cargados.');
    }
  }

  async login(email: string, password: string): Promise<any> {
    const users = await this.db.getUsers();

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
      return user;
    }
    return null;
  }

  logout() {
    localStorage.removeItem('loggedUser');
  }

  getCurrentUser() {
    const user = localStorage.getItem('loggedUser');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedUser');
  }
}
