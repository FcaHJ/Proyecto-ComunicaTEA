import { Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { Theme } from './services/theme';
import { Users } from './services/users';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule, CommonModule, RouterLink, SplashComponent]
})
export class AppComponent {

  isMobile: boolean = true;
  isLoggedIn = false; 

  constructor(private platform: Platform, 
    private users: Users,
    private auth: AuthService, 
    private router: Router,
    private theme: Theme //no eliminar
   ) {
    this.isMobile = this.platform.width() < 768;
    this.init();
  }

  showSplash = true;
  hideSplash(){
    this.showSplash = false;
  }

  async init() {
    //await this.theme.loadTheme();
    await this.users.loadUsers();
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  async logout() {
    console.log("Cerro su sesion");
    this.auth.logout();
    this.isLoggedIn = false;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // método para actualizar el login cuando haces login desde login.page
  updateLoginStatus(status: boolean) {
    this.isLoggedIn = status;
  }
}
