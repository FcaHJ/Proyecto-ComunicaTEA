import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private _storage: Storage | null = null;
  private readonly COLOR_KEY = 'appBackgroundColor';
  private readonly LANGUAGE_KEY = 'appLanguage';
  private readonly INTENSITY_KEY = 'appColorIntensity';
  private readonly VOICE_GENDER_KEY = 'voiceGender';
  private readonly VOICE_TONE_KEY = 'voiceTone';



  selectedLanguage: string = 'es';

  constructor(private storage: Storage) { 
    this.ngOnInit();
  }

  async ngOnInit() {
    this._storage = await this.storage.create();
    this.loadTheme();
  }

  // Aplica el color con brillo ajustado
  setBackgroundColor(color: string, intensity: number = 0) {
    const adjusted = this.adjustColorBrightness(color, intensity);
    this.applyColor(adjusted);
    this.saveTheme(color, intensity);
  }

  applyColor(color: string) {
    document.documentElement.style.setProperty('--app-background', color);

    const textColor = this.getContrastColor(color);
    document.documentElement.style.setProperty('--app-text-color', textColor);
    document.documentElement.style.setProperty('--app-border-color', textColor);
  }

  private getContrastColor(hex: string): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  async saveTheme(color: string, intensity: number) {
    if (!this._storage) return;
    await this._storage.set(this.COLOR_KEY, color);
    await this._storage.set(this.INTENSITY_KEY, intensity);
  }

  async loadTheme() {
    if (!this._storage) return;
    const lang = await this._storage.get(this.LANGUAGE_KEY);
    if (lang) this.selectedLanguage = lang;

    const savedColor = await this._storage.get(this.COLOR_KEY);
    const savedIntensity = await this._storage.get(this.INTENSITY_KEY);

    if (savedColor !== null) {
      const adjusted = this.adjustColorBrightness(savedColor, savedIntensity || 0);
      this.applyColor(adjusted);

    }
  }

  async changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    await this._storage?.set(this.LANGUAGE_KEY, lang);
    console.log('Idioma cambiado a:', lang);
  }

  async setVoiceGender(gender: string) {
    await this._storage?.set(this.VOICE_GENDER_KEY, gender);
  }

  async getVoiceGender(): Promise<string | null> {
    return await this._storage?.get(this.VOICE_GENDER_KEY);
  }

  async setVoiceTone(tone: string) {
    await this._storage?.set(this.VOICE_TONE_KEY, tone);
  }

  async getVoiceTone(): Promise<string | null> {
    return await this._storage?.get(this.VOICE_TONE_KEY);
  }

  // 🔹 Ajusta brillo del color base
  private adjustColorBrightness(hex: string, percent: number): string {
    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Si percent es positivo, aclaramos. Si es negativo, oscurecemos.
  if (percent > 0) {
    r = r + ((255 - r) * percent / 100);
    g = g + ((255 - g) * percent / 100);
    b = b + ((255 - b) * percent / 100);
  } else {
    r = r * (1 + percent / 100);
    g = g * (1 + percent / 100);
    b = b * (1 + percent / 100);
  }

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));


    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
  }

  private toHex(value: number): string {
    const hex = Math.round(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

}
