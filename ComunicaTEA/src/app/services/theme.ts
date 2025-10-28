import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private _storage: Storage | null = null;
  private readonly COLOR_KEY = 'appBackgroundColor';
  private readonly LANGUAGE_KEY = 'appLanguage';

  selectedLanguage: string = 'es';

  constructor(private storage: Storage) { 
  }

  async ngOnInit() {
    this._storage = await this.storage.create();
    this.loadTheme();
  }
  
  setBackgroundColor(color: string) {
    this.applyColor(color);
    this.saveTheme(color);
  }

  applyColor(color: string) {
    document.documentElement.style.setProperty('--app-background', color);
    // Detectar brillo del color para texto accesible
    const textColor = this.getContrastColor(color);
    document.documentElement.style.setProperty('--app-text-color', textColor);
    document.documentElement.style.setProperty('--app-border-color', textColor);
  }

  private getContrastColor(hex: string): string {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);

    // Fórmula estándar de accesibilidad WCAG
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "#000000" : "#FFFFFF";
  }

  
async saveTheme(color: string) {
    if (!this._storage) return;
    await this._storage.set(this.COLOR_KEY, color);
  }

  async loadTheme() {
    if (!this._storage) return;
    const lang = await this._storage?.get(this.LANGUAGE_KEY);
    if (lang) this.selectedLanguage = lang;

    const savedColor = await this._storage.get(this.COLOR_KEY);
    if (savedColor) {
      this.applyColor(savedColor);
    }
  }

  async changeLanguage(lang: string) {
    this.selectedLanguage = lang;
    await this._storage?.set(this.LANGUAGE_KEY, lang);
    console.log('Idioma cambiado a:', lang);
  }
}
