import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

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
  // Usuario de prueba
    const testUser = {
      email: 'admin@demo.com',
      password: '123456',
      name: 'Administrador de prueba',
    };

    // Validar credenciales
    if (this.email === testUser.email && this.password === testUser.password) {
      await this.storage.set('user', testUser); // Guardar usuario en Storage
      console.log("Inicio de sesion exitoso!")
      this.goBack();
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}
