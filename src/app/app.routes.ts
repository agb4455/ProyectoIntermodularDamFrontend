import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'lobby',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/lobby-page/lobby-page.component').then((c) => c.LobbyPageComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin-page/admin-page.component').then((c) => c.AdminPageComponent),
  },
  {
    path: 'stats/user',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/statistics/statistics.component').then((c) => c.StatisticsComponent),
  },
  {
    path: 'game',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/game/game.component').then((c) => c.GamePageComponent),
  },
  {
    path: 'config',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/user-config/user-config.component').then((c) => c.UserConfigComponent),
  },
  {
    path: 'personajes',
    loadComponent: () => import('./pages/characters-page/characters-page.component').then((c) => c.CharactersPageComponent),
  },
  {
    path: 'reglas',
    loadComponent: () => import('./pages/rules-page/rules-page.component').then((c) => c.RulesPageComponent),
  },
];
