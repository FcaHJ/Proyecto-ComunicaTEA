import { Component } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
import { Theme } from './services/theme';
import { Users } from './services/users';
import { AuthService } from './services/auth-service';
import { AlertController } from '@ionic/angular/standalone';

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
    private theme: Theme, //no eliminar
    private alertController: AlertController
   ) {
    this.isMobile = this.platform.width() < 768;
    this.auth.isLoggedIn$.subscribe(state => {
      console.log("Cambio detectado -> isLoggedIn:", state);
      this.isLoggedIn = state;

    });
  }

  showSplash = true;
  hideSplash(){
    this.showSplash = false;
  }

  async init() {
  }

  async logout() {
  const alert = await this.alertController.create({
    header: 'Cerrar sesión',
    message: '¿Seguro que quiere cerrar sesión?',
    buttons: [
      {
        text: 'No',
        role: 'cancel'
      },
      {
        text: 'Sí',
        handler: () => {
          this.auth.logout();
          console.log("Cerró su sesión");
        }
      }
    ]
  });

  await alert.present();
}

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
