import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule, CommonModule, RouterLink, SplashComponent]
})
export class AppComponent {
  constructor() {}
  showSplash = true;
  
  hideSplash(){
    this.showSplash = false;
  }
}
