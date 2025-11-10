import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Cards } from '../../services/cards';

@Component({
  selector: 'app-select-card-modal',
  templateUrl: './select-card.modal.html',
  styleUrls: ['./select-card.modal.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SelectCardModal implements OnInit {

  @Input() existingCards: any[] = [];
  allCards: any[] = [];

  constructor(
    private cardService: Cards,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.allCards = await this.cardService.getCards();

    // evitar cartas duplicadas
    this.allCards = this.allCards.filter(
      c => !this.existingCards.some(e => e.id === c.id)
    );
  }

  selectCard(card: any) {
    this.modalCtrl.dismiss(card);
  }

  close() {
    this.modalCtrl.dismiss(null);
  }
}

