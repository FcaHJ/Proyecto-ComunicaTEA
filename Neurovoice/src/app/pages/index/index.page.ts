import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Cards } from '../../services/cards';
import { ModalController } from '@ionic/angular';
import { CardViewModal } from '../../modals/card-view/card-view.modal';
import { IndexedDBService } from '../../services/indexeddb.service';


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
    private cardService: Cards,
    private modalCtrl: ModalController, 
    private indexedDB: IndexedDBService,
    private db: IndexedDBService
  ) { }

  async ngOnInit() {
    this.cards = await this.cardService.getCards();
    try {
      // Intentar obtener cartas desde IndexedDB
      const storedCards = await this.indexedDB.getCards();

      // Versión local de los datos
      const currentVersion = 3; // <- aumenta este número cuando modifiques algo
      const storedVersion = Number(localStorage.getItem('cardsVersion')) || 0;

      // Cargar cartas del JSON
      const response = await fetch('assets/data/cards.json');
      const jsonCards = await response.json();

      // Si no hay cartas guardadas, cargar desde cards.json
      if (!storedCards || storedCards.length !== jsonCards.length || storedVersion < currentVersion) {
        console.log('Reemplazando cartas antiguas por las nuevas...');
        // Guardar las cartas en IndexedDB para persistencia
        await this.indexedDB.replaceAllCards(jsonCards);
        localStorage.setItem('cardsVersion', currentVersion.toString());
        this.cards = jsonCards;
      } else {
        // Si ya existen cartas guardadas, usarlas directamente
        this.cards = storedCards;
      }

      // Asegurar que las cartas se muestren siempre
      this.filteredCards = this.cards;

      } catch (error) {
        console.error('Error cargando cartas:', error);
      }
    }


  async toggleFav(card : any){
    card.fav = !card.fav;
    await this.cardService.setCards(this.cards);
  }

  categories = [
    'Favoritos', 'Tecnología', 'Hogar', 'Deporte', 'Alimentación', 
    'Ocio', 'Necesidades', 'Emociones', 'Relaciones', 'Animales'];

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
    // Si ya está seleccionada, deseleccionamos
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
    cssClass: 'card-modal'
  });

  modal.componentProps = { card };

  await modal.present();
}

  closeModal() {
    this.isModalOpen = false;
    this.selectedCard = null;
  }


  shouldShowCard(card: any): boolean {
  if (!this.selectedCategory) return true;

  if (this.selectedCategory === 'Favoritos') {
    return card.fav;
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
