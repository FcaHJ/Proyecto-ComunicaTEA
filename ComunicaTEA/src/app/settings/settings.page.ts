import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Theme } from '../services/theme';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class SettingsPage implements OnInit {

  selectedLanguage: string = 'es';

  colors: string[] = [
    '#ff0000', '#ff7f00', '#ffff00', '#7fff00', '#00ff00',
    '#00ff7f', '#00ffff', '#007fff', '#0000ff', '#7f00ff',
    '#ff00ff', '#ff007f', '#ffffff', '#000000'
  ];

  constructor(private themeService: Theme){}

  ngOnInit(){
  }

  setColor(color: string) {
  this.themeService.setBackgroundColor(color);
  }

  getSliceTransform(index: number, total: number): string {
      const angle = (360 / total) * index;
      return `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`;
  }

  changeLanguage(event: any) {
    const lang = event.detail.value;
    this.themeService.changeLanguage(lang);
  }
 

}
