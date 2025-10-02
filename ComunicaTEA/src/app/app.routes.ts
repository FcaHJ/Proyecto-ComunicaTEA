import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index', 
    pathMatch: 'full'
  },

  { 
    path: 'index', 
    loadComponent: () => import('./index/index.page').then(m => m.IndexPage) 
  },
  
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  }

];
