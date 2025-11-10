import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  imports: [CommonModule, IonIcon]
})
export class SplashComponent  implements OnInit {
  @Output() finished = new EventEmitter<void>();
  puzzleIcons = [
    { color: '#FF6B6B', delay: 0 },
    { color: '#6BCB77', delay: 0.2 },
    { color: '#4D96FF', delay: 0.4 },
    { color: '#FFD93D', delay: 0.6 },
    { color: '#FF6BCB', delay: 0.8 },
  ];

  constructor() { }

  ngOnInit() {
    //Duracion animacion
    setTimeout(() => {
      this.finished.emit();
    }, 3000); 
  }

}
