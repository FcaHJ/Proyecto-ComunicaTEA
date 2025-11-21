import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Cards } from 'src/app/services/cards';
import { Tts, VoiceGender, VoiceTone } from 'src/app/services/tts';
import { Theme } from 'src/app/services/theme';
import { IndexedDBService } from 'src/app/services/indexeddb.service';

@Component({
  selector: 'app-card-view-modal',
  standalone: true,
  templateUrl: './card-view.modal.html',
  styleUrls: ['./card-view.modal.scss'],
  imports: [IonicModule, CommonModule]
})
export class CardViewModal {
  selectedCard: any = null;

  @Input() card: any;
    voiceGender: VoiceGender = 'male';
    voiceTone: VoiceTone = 'neutral';

  constructor(
    private modalCtrl: ModalController,
    private cardService: Cards, 
    private tts: Tts,
    private theme: Theme,
  ) {}

  async ngOnInit() {
  const gender = await this.theme['_storage']?.get('voiceGender');
  const tone = await this.theme['_storage']?.get('voiceTone');

  if (gender) this.voiceGender = gender;
  if (tone) this.voiceTone = tone;

  console.log("⚙️ Ajustes cargados →", this.voiceGender,';', this.voiceTone);
}


  close() {
    this.modalCtrl.dismiss();
    this.selectedCard = null;
  }
  async onCardClick(cardId: number) {
    const card = await this.cardService.getCardById(cardId);
    if (card) {
      console.log('Funciona')
      this.tts.speak(card.description, this.voiceGender, this.voiceTone);
    }
  }

}



