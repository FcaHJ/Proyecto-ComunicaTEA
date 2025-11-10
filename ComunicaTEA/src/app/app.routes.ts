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
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'collections',
    loadComponent: () => import('./collections/collections.page').then(m => m.CollectionsPage)
  },

  {
    path: 'collection/:id',
    loadComponent: () => import('./collection/collection.page').then(m => m.CollectionPage)
  }


];
