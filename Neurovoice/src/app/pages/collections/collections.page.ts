import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardApiService } from '../../services/cards.api.service';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';



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
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadCollections();
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
          handler: (data) => {
            if (!data.name) return;

            this.api.createCollection({
              name: data.name,
              max_cards: 5
            }).subscribe({
              next: () => this.loadCollections(),
              error: (err) => console.error(err)
            });
          }
        }
      ]
    });

    alert.present();
  }

    addCardToCollection(collectionId: number, card: any) {
    this.api.getCollections().subscribe(collections => {

      const col = collections.find(c => c.id === collectionId);
      if (!col) return;

      if (col.cards.length >= 5) {
        alert('Esta colección ya tiene el máximo de 5 cartas.');
        return;
      }

      // Agregar carta localmente
      col.cards.push(card);

      // Actualizar en el backend
      this.api.updateCollection(collectionId, col).subscribe({
        next: () => {
          console.log("Colección actualizada correctamente");
        },
        error: (err) => {
          console.error("Error al actualizar la colección", err);
        }
      });

    });
  }

  async deleteCollection(id: number) {

    const alert = await this.alertCtrl.create({
      header: 'Eliminar colección',
      message: '¿Seguro que deseas eliminar esta colección?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteCollection(id).subscribe({
              next: () => this.loadCollections(),
              error: (err) => console.error(err)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.loadCollections();
  }

  loadCollections() {
    this.api.getCollections().subscribe({
      next: (data) => this.collections = data,
      error: (err) => console.error(err)
    });
  }





}
