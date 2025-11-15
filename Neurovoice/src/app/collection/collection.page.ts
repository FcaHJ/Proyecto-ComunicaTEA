import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Cards } from '../services/cards';
import { SelectCardModal } from '../modals/select-card/select-card.modal';
import { CardViewModal } from '../modals/card-view/card-view.modal';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-collection',
  standalone: true,
  templateUrl: './collection.page.html',
  styleUrls: ['./collection.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class CollectionPage implements OnInit {

  collection: any = null;

  constructor(
    private route: ActivatedRoute,
    private cardService: Cards,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    const collections = await this.cardService.getCollections();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.collection = collections.find(c => c.id === id);
  }

  async openSelectModal() {
    const modal = await this.modalCtrl.create({
      component: SelectCardModal,
      componentProps: {
        existingCards: this.collection.cards
      }
    });

    modal.onDidDismiss().then(async res => {
      if (!res.data) return;

      const card = res.data;

      if (this.collection.cards.length >= 5) {
        const alert = await this.alertCtrl.create({
          header: 'Límite alcanzado',
          message: 'Máximo 5 cartas por colección.',
          buttons: ['OK']
        });

        await alert.present();
        return;
        }

      this.collection.cards.push(card);

      const collections = await this.cardService.getCollections();
      const index = collections.findIndex(c => c.id === this.collection.id);
      collections[index] = this.collection;
      await this.cardService.setCollections(collections);
    });

    modal.present();
  }

  async openCard(card: any) {
  const modal = await this.modalCtrl.create({
    component: CardViewModal,
    cssClass: 'card-modal',
    componentProps: { card }
  });

  await modal.present();
}


async removeCard(cardId: number) {
  const alert = await this.alertCtrl.create({
    header: 'Eliminar carta',
    message: '¿Quieres quitar esta carta de la colección?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Eliminar',
        handler: async () => {
          this.collection.cards = this.collection.cards.filter((c: any) => c.id !== cardId);

          const collections = await this.cardService.getCollections();
          const index = collections.findIndex(c => c.id === this.collection.id);
          collections[index] = this.collection;

          await this.cardService.setCollections(collections);
        }
      }
    ]
  });

  await alert.present();
  }



}

