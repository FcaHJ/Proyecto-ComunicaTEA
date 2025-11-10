import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-view-modal',
  standalone: true,
  templateUrl: './card-view.modal.html',
  styleUrls: ['./card-view.modal.scss'],
  imports: [IonicModule, CommonModule]
})
export class CardViewModal {

  @Input() card: any;

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }

}



