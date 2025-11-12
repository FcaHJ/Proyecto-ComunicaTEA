import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Cards } from 'src/app/services/cards';
import { Tts } from 'src/app/services/tts';

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

  constructor(
    private modalCtrl: ModalController,
    private cardService: Cards, 
    private tts: Tts
  ) {}

  close() {
    this.modalCtrl.dismiss();
    this.selectedCard = null;
  }
  async onCardClick(cardId: number) {
    console.log('Card ID clickeada:', cardId, this.selectedCard);
    const card = await this.cardService.getCardById(cardId);
    if (card) {
      console.log('Texto a leer:', card.description);
      this.tts.speak(card.description);
    }
  }

}



