import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Theme } from '../../services/theme';
import { AuthService } from '../../services/auth-service';
import { Tts, VoiceGender, VoiceTone } from '../../services/tts';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {

  selectedColor: string = "ffffff";
  intensity: number = 0;
  selectedLanguage: string = 'es';
  user: any = null;
  voiceGender: VoiceGender = 'male';
  voiceTone: VoiceTone = 'neutral';


  colors: string[] = [
    '#ff0000', '#ff7f00', '#ffff00', '#7fff00', '#00ff00',
    '#00ff7f', '#00ffff', '#007fff', '#0000ff', '#7f00ff',
    '#ff00ff', '#ff007f', '#ffffff', '#000000'
  ];

  constructor(private themeService: Theme, private auth: AuthService, private tts: Tts){}

  ngOnInit(){
      this.auth.currentUser$.subscribe(user => {
        this.user = user;
    });

    // Cargar color e intensidad guardados al abrir la página
    this.themeService['loadTheme'](); // aplica el tema actual

    // Recuperar valores guardados desde el storage
    this.themeService['_storage']?.get('appBackgroundColor').then((color) => {
      if (color) this.selectedColor = color;
    });

    this.themeService['_storage']?.get('appColorIntensity').then((intensity) => {
      if (intensity !== null && intensity !== undefined) {
        this.intensity = intensity;
      }
    });

    // Cargar ajustes de voz
    this.themeService['_storage']?.get('voiceGender').then(g => {
      if (g) this.voiceGender = g;
    });

    this.themeService['_storage']?.get('voiceTone').then(t => {
      if (t) this.voiceTone = t;
    });


  }

  getSliceTransform(index: number, total: number): string {
      const angle = (360 / total) * index;
      return `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`;
  }

  setColor(color: string) {
    this.selectedColor = color;
    this.themeService.setBackgroundColor(color, this.intensity);
  }

  adjustIntensity() {
    this.themeService.setBackgroundColor(this.selectedColor, this.intensity);
  }

  async changeVoiceGender(event: any) {
  this.voiceGender = event.detail.value;
  await this.themeService['_storage']?.set('voiceGender', this.voiceGender);
}

async changeVoiceTone(event: any) {
  this.voiceTone = event.detail.value;
  await this.themeService['_storage']?.set('voiceTone', this.voiceTone);
}



}
