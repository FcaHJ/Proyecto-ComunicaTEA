import { Injectable } from '@angular/core';
import { IndexedDBService } from './indexeddb.service';

@Injectable({
  providedIn: 'root'
})
export class Users {

  constructor(private db: IndexedDBService){

  }

  async loadUsers() {
  try {
    const storedUsers = await this.db.getUsers();
    const currentVersion = 2; // Cambia este número si actualizas users.json
    const storedVersion = Number(localStorage.getItem('usersVersion')) || 0;

    if (!storedUsers || storedUsers.length === 0 || storedVersion < currentVersion) {
      console.log('Actualizando usuarios desde JSON...');
      const res = await fetch('assets/data/users.json');
      const jsonUsers = await res.json();
      await this.db.replaceAllUsers(jsonUsers);
      localStorage.setItem('usersVersion', currentVersion.toString());
    }
  } catch (error) {
    console.error('Error cargando usuarios:', error);
  }
}

async getAll() {
  return await this.db.getUsers();
}


}
