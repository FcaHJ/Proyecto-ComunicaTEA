import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Cards } from '../services/cards';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IndexPage implements OnInit {
  cards: any[] = [];
  selectedCategory: string | null = null;
  isModalOpen = false;
  selectedCard: any = null;

  constructor(private cardService: Cards) { }

  async ngOnInit() {
    this.cards = await this.cardService.getCards();

    if (this.cards.length === 0){
      this.cards = [
        {id:1, image: 'assets/image/jugar.png', description:'Jugar', category: 'Deporte',fav: true},
        {id:2, image: 'assets/image/afuera.png', description:'Afuera', category: 'Ocio', fav: false},
        {id:3, image: 'assets/image/musica.png', description:'Música', category: 'Ocio', fav: false},
        {id:4, image: 'assets/image/comida.png', description:'Comida', category: 'Alimentación', fav: false},
      ];
      await this.cardService.setCards(this.cards);
    }
  }

  async toggleFav(card : any){
    card.fav = !card.fav;
    await this.cardService.setCards(this.cards);
  }

  categories = ['Favoritos', 'Tecnología', 'Hogar', 'Deporte', 'Alimentación', 'Ocio'];

  selectCategory(category: string) {
    if (this.selectedCategory === category) {
    // Si ya está seleccionada, deseleccionamos
    this.selectedCategory = null;
  } else {
    this.selectedCategory = category;
  }
  }

  openModal(card: any) {
    this.selectedCard = card;
    this.isModalOpen = true;
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



  animateCard(event: Event, card: any) {
  const element = (event.currentTarget as HTMLElement);
  element.classList.add('clicked');

  // abre el modal después de la animación
  setTimeout(() => {
    this.openModal(card);
    element.classList.remove('clicked');
  }, 150); // duración de la animación
  }


}
