import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardApiService } from '../../services/cards.api.service';
import { ModalController } from '@ionic/angular';
import { CardViewModal } from '../../modals/card-view/card-view.modal';
import { IndexedDBService } from '../../services/indexeddb.service';
import { ApiService } from '../../services/api.service';



@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IndexPage implements OnInit {
  cards: any[] = [];
  filteredCards: any[] = [];
  selectedCategory: string | null = null;
  isModalOpen = false;
  selectedCard: any = null;

  constructor(
    private modalCtrl: ModalController,
    private db: IndexedDBService,
    private api: ApiService
  ) { }

  async ngOnInit() {
    this.loadCards();
  }


  loadCards() {
    this.api.getCards().subscribe({
      next: (data) => {
        this.cards = data;
        this.filteredCards = data;
      },
      error: (err) => console.error(err)
    });
  }


  toggleFav(card: any) {
  card.fav = !card.fav; // cambia en pantalla primero

  this.api.toggleFavorite(card.id, card.fav).subscribe({
    next: () => console.log("Favorito actualizado"),
    error: (err) => {
      console.error("Error al actualizar fav", err);
      // Si falla, revertir cambio local
      card.fav = !card.fav;
    }
    });
  }


  categories = [
    'Favoritos', 'Tecnología', 'Hogar', 'Deporte', 'Alimentación',
    'Ocio', 'Necesidades', 'Emociones', 'Relaciones', 'Animales'];

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
      this.filteredCards = this.cards;
    } else {
      this.selectedCategory = category;
      this.filteredCards = this.cards.filter(c => this.shouldShowCard(c));
    }
  }


  async openModal(card: any) {
      const modal = await this.modalCtrl.create({
        component: CardViewModal,
        cssClass: 'card-modal',
        componentProps: { card }
      });

      await modal.present();
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCard = null;
  }


  shouldShowCard(card: any): boolean {
    if (!this.selectedCategory) return true;

    if (this.selectedCategory === 'Favoritos') {
      return card.fav === true;
    }

    return card.category === this.selectedCategory;
  }



  async animateCard(event: Event, card: any) {
  const element = (event.currentTarget as HTMLElement);
  element.classList.add('clicked');

  // abre el modal después de la animación
  setTimeout(() => {
    this.openModal(card);
    element.classList.remove('clicked');
  }, 150); // duración de la animación

  // 🔥 GUARDAR ESTADÍSTICAS
  await this.db.saveDailyCardUsage(card);
  const today = await this.db.getAllDailyRecords();
  }


}
