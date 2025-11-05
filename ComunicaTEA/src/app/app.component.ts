import { Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule, CommonModule, RouterLink, SplashComponent]
})
export class AppComponent {

  isMobile: boolean = true;
  isLoggedIn = false; 

  constructor(private platform: Platform, private storage: Storage) {
    this.isMobile = this.platform.width() < 768;
    this.init();
  }

  showSplash = true;
  hideSplash(){
    this.showSplash = false;
  }

  async init() {
    await this.storage.create();
    const user = await this.storage.get('user');
    this.isLoggedIn = !!user; // true si ya hay usuario guardado
  }

  async logout() {
    console.log("Cerro su sesion")
    await this.storage.remove('user');
    this.isLoggedIn = false;
  }

  // método para actualizar el login cuando haces login desde login.page
  updateLoginStatus(status: boolean) {
    this.isLoggedIn = status;
  }
}
