import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },

  {
    path: 'index',
    loadComponent: () => import('./pages/index/index.page').then(m => m.IndexPage)
  },

  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'collections',
    loadComponent: () => import('./pages/collections/collections.page').then(m => m.CollectionsPage)
  },

  {
    path: 'collection/:id',
    loadComponent: () => import('./pages/collection/collection.page').then(m => m.CollectionPage)
  },
  {
    path: 'daily-stats',
    loadComponent: () => import('./pages/daily-stats/daily-stats.page').then( m => m.DailyStatsPage)
  }



];
