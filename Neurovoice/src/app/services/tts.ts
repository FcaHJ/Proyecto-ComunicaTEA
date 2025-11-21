import { Injectable } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export type VoiceGender = 'female' | 'male';
export type VoiceTone = 'happy' | 'calm' | 'neutral';

@Injectable({
  providedIn: 'root'
})
export class Tts {

  private toneSettings = {
    happy : { pitch: 1.3, rate: 1.15},
    calm : { pitch: 0.8, rate: 0.85},
    neutral : { pitch: 1.0, rate: 1.0}
  }

  constructor() {}

  async speak(text: string, gender: VoiceGender, tone: VoiceTone) {
    const toneCfg = this.toneSettings[tone]
    // ⚡ WEB: SpeechSynthesis permite elegir voces femeninas o masculinas
    if (!(window as any).Capacitor?.isNativePlatform()) {
      const voices = speechSynthesis.getVoices();
      
      // Filtramos voces femeninas / masculinas
      const selectedVoice = voices.find(v =>
        gender === 'female'
          ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('femenina')
          : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('man') || v.name.toLowerCase().includes('masculina')
      ) || voices[0]; // fallback

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-ES';
      utter.voice = selectedVoice;
      utter.pitch = toneCfg.pitch;
      utter.rate = toneCfg.rate;
      
      speechSynthesis.speak(utter);
      return;
    }

    // NATIVO (Android/iOS no soporta voces por género)
    // Pero aplicamos tonalidades
    await TextToSpeech.speak({
      text,
      lang: 'es-ES',
      pitch: toneCfg.pitch,
      rate: toneCfg.rate,
    });
  }
}
