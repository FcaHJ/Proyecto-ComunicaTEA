import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Cards } from '../../services/cards';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-collections',
  standalone: true,
  templateUrl: './collections.page.html',
  styleUrls: ['./collections.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ]
})
export class CollectionsPage implements OnInit {

  collections: any[] = [];

  constructor(
    private cardService: Cards,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadCollections();
  }

  async createCollection() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva colección',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la colección'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.name) return;

            const newCollection = {
              id: Date.now(),
              name: data.name,
              cards: []  // Aquí el usuario agregará hasta 10
            };

            this.collections.push(newCollection);
            await this.cardService.setCollections(this.collections);
          }
        }
      ]
    });

    alert.present();
  }

  async addCardToCollection(collectionId: number, card: any) {
  const collections = await this.cardService.getCollections();
  const col = collections.find(c => c.id === collectionId);

  if (!col) return;

  if (col.cards.length >= 5) {
    alert('Esta colección ya tiene el máximo de 5 cartas.');
    return;
  }

  col.cards.push(card);
  await this.cardService.setCollections(collections);
  }

  async deleteCollection(id: number) {

  const alert = await this.alertCtrl.create({
    header: 'Eliminar colección',
    message: '¿Seguro que deseas eliminar esta colección?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: async () => {
          await this.cardService.deleteCollection(id);
          this.collections = this.collections.filter(c => c.id !== id);
        }
      }
    ]
  });

  await alert.present();
  }

  ionViewWillEnter() {
  this.loadCollections();
  }

  async loadCollections() {
  this.collections = await this.cardService.getCollections();
  }





}
