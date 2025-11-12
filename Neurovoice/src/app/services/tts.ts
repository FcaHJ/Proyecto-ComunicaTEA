import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Injectable({
  providedIn: 'root'
})
export class Tts {

  constructor() {}

  async speak(text: string): Promise<void> {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.pitch = 1;
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
        console.log("leyendo tarjeta...."); 
      } else {
        console.warn('TTS no soportado en este navegador');
      }
    } catch (error) {
      console.error('Error al reproducir texto:', error);
    }
  }
}
