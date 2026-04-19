import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then((c) => c.AdminComponent),
  },
  {
    path: 'stats/user',
    loadComponent: () => import('./pages/statistics-view/statistics.component').then((c) => c.StatsComponent),
  },
  {
    path: 'game',
    loadComponent: () => import('./pages/game/game.component').then((c) => c.GamePageComponent),
  },
];
