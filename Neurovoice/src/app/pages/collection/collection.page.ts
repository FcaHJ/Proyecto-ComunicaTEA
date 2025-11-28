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
import { Tts } from 'src/app/services/tts';





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

  collection: any;
  collectionId!: number;

  constructor(
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private tts: Tts,
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

      const newPosition = this.collection.cards.length;

      this.api.addCardToCollection(this.collectionId, card.id, newPosition).subscribe({
        next: () => {
          this.collection.cards.push({ ...card });
        },
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


  async readCollection() {
    if (!this.collection || !this.collection.cards || this.collection.cards.length === 0) {
      await this.tts.speak('Esta colección está vacía.', 'female', 'neutral');
      return;
    }

    // Ordenar cartas por posición si existe
    const cardsOrdered = [...this.collection.cards].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    // Generar frase coherente con buildSmartSentence
    const frase = this.buildSmartSentence(cardsOrdered);

    await this.tts.speak(frase, 'female', 'calm');
  }


private buildSmartSentence(cards: any[]): string {
  const words = cards.map(c => c.description.toLowerCase().trim());

  // --- Diccionarios ---
  const lugares = ["fuera", "cine", "parque", "casa", "escuela", "playa", "jardin"];

  const estados = ["calor", "frio"]; // van con "tengo"

  const emociones = ["enojo", "triste", "feliz", "cansancio", "confusion"]; // van con "estoy"

  const articulos: Record<string, string> = {
    perro: "el perro",
    gato: "el gato",
    agua: "el agua",
    comida: "la comida",
    carne: "la carne",
    jugo: "el jugo",
    postre: "el postre",
    celular: "el celular",
    tablet: "la tablet",
    computador: "el computador",
    música: "la música",
    // Cambios para emociones → forma correcta
    cansancio: "cansado",
    enojo: "enojado",
    confusion: "confundido"
  };

  // 1. Saludos
  if (words.includes("hola")) return "Hola.";
  if (words.includes("adios")) return "Adiós.";
  if (words.includes("silencio")) return "Necesito silencio.";

  // 2. Verbo
  let verb = words.find(w =>
    w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir") ||
    ["quiero", "necesito, ", "tengo", "estoy"].includes(w)
  );

  // 3. Estado (calor, frío…)
  const estado = words.find(w => estados.includes(w));

  // 4. Emoción (feliz, triste…)
  const emocion = words.find(w => emociones.includes(w));

  // Si NO hay verbo pero sí emoción → "estoy feliz"
  if (!verb && emocion) {
    const emoFinal = articulos[emocion] || emocion;
    return `Estoy ${emoFinal}.`;
  }

  // Si NO hay verbo pero sí estado → "estoy con calor"
  if (!verb && estado) {
    return `Tengo ${estado}.`;
  }

  // 5. Armar frase verbal
  let verbo = "";
  if (!verb) {
    verbo = "quiero";
  } else if (["quiero", "necesito", "tengo", "estoy"].includes(verb)) {
    verbo = verb;
  } else {
    verbo = "quiero " + verb;
  }

  // 6. Lugar
  const lugar = words.find(w => lugares.includes(w));

  // 7. Objetos (todo lo que no sea verbo, lugar, estado o emoción)
  let objetos = words.filter(w =>
    w !== verb && w !== lugar && w !== estado && w !== emocion
  );

  objetos = objetos.map(w => articulos[w] || w);

  // --- Construcción final ---
  let frase = verbo;

  // Lugar
  if (lugar) frase += lugar === "fuera" ? " fuera" : " en " + lugar;

  // Objetos
  if (objetos.length > 0) frase += " con " + objetos.join(" y ");

  // Estado como razón
  if (estado) frase += " porque tengo " + estado;

  // Emoción como razón
  if (emocion) {
    const emoFinal = articulos[emocion] || emocion;
    frase += " porque estoy " + emoFinal;
  }

  frase = frase.trim() + ".";
  return frase.charAt(0).toUpperCase() + frase.slice(1);
}


}

