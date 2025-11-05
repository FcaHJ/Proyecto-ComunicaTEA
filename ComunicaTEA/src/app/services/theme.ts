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


  selectedLanguage: string = 'es';

  constructor(private storage: Storage) { 
    this.ngOnInit();
  }

  async ngOnInit() {
    this._storage = await this.storage.create();
    this.loadTheme();
  }

  // 🔹 Aplica el color con brillo ajustado
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

  // 🔹 Ajusta brillo del color base
  private adjustColorBrightness(hex: string, percent: number): string {
    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Si percent > 0 → aclarar, si < 0 → oscurecer
    const factor = 1 + percent / 100;

    r = Math.min(255, Math.max(0, r * factor));
    g = Math.min(255, Math.max(0, g * factor));
    b = Math.min(255, Math.max(0, b * factor));

    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
  }

  private toHex(value: number): string {
    const hex = Math.round(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

}
