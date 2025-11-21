import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyStatsPage } from './daily-stats.page';

describe('DailyStatsPage', () => {
  let component: DailyStatsPage;
  let fixture: ComponentFixture<DailyStatsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
