import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardApiService } from '../../services/cards.api.service';
import { SelectCardModal } from '../../modals/select-card/select-card.modal';
import { CardViewModal } from '../../modals/card-view/card-view.modal';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { firstValueFrom } from 'rxjs';





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
  collectionId!: number;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.collectionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCollection();
  }

  async loadCollection() {
  this.collectionId = Number(this.route.snapshot.paramMap.get('id'));

  const collections = await firstValueFrom(this.api.getCollections());
  this.collection = collections.find(c => c.id === this.collectionId) || null;

  if (!this.collection) {
    console.error("Collection NOT FOUND");
    return;
  }

  console.log("Loaded collection:", this.collection);
}

  async openSelectModal() {
    const modal = await this.modalCtrl.create({
      component: SelectCardModal,
      componentProps: {
        existingCards: this.collection.cards
      }
    });

    modal.onDidDismiss().then(res => {
      if (!res.data) return;

      const card = res.data;

      this.api.addCardToCollection(this.collectionId, card.id).subscribe({
        next: () => this.loadCollection(),
        error: async (err) => {

          if (err.error?.error === 'Collection has reached max_cards') {
            const alert = await this.alertCtrl.create({
              header: 'Límite alcanzado',
              message: 'Máximo 5 cartas por colección.',
              buttons: ['OK']
            });
            alert.present();
          }

          console.error(err);
        }
      });
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
            handler: () => {
              this.api.removeCardFromCollection(this.collectionId, cardId).subscribe({
                next: () => this.loadCollection(),
                error: (err) => console.error(err)
              });
            }
          }
        ]
      });

      alert.present();
  }



}

