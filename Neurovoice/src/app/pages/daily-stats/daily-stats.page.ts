import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IndexedDBService } from 'src/app/services/indexeddb.service';

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.page.html',
  styleUrls: ['./daily-stats.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DailyStatsPage implements OnInit {

  todayStats: any[] = [];

  constructor(private db: IndexedDBService) { }

  async ngOnInit() {
    this.todayStats =( await this.db.getTodayStats()).sort((a, b) => b.count - a.count);
  }

  async ionViewWillEnter() {
    this.todayStats =( await this.db.getTodayStats()).sort((a, b) => b.count - a.count);

}

}
