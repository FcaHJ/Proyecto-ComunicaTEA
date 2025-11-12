import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private navCtrl: NavController, 
    private storage: Storage,
    private auth: AuthService,
    private router: Router
  ) {
    this.ngOnInit();
  }

  goBack() {
    this.navCtrl.back(); // vuelve a la página anterior
  }

  async ngOnInit() {
    await this.storage.create();
  }

  async loginUser() {
    try {
      const user = await this.auth.login(this.email, this.password);

      if (user) {
        // redirigir según el rol
        if (user.role === 'admin') {
          this.router.navigate(['/usuarios']);
        } else if (user.role === 'user') {
          this.router.navigate(['/index']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = 'Hubo un error al intentar iniciar sesión.';
    }
  }
}