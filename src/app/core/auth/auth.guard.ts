import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard que permite el acceso solo a usuarios autenticados.
 * Si el usuario no está logueado, redirige a la home con el parámetro 'login=true'
 * para disparar la apertura del modal de autenticación.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirigir a home y pedir login
  return router.createUrlTree(['/'], { queryParams: { login: 'true' } });
};

/**
 * Guard que permite el acceso solo a administradores.
 * - Si no está logueado: redirige a home con 'login=true'.
 * - Si está logueado pero no es ADMIN: redirige a home sin parámetros.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if (authService.isAdmin()) {
      return true;
    }
    // Usuario autenticado pero sin permisos de admin -> Redirigir a home a secas
    return router.createUrlTree(['/']);
  }

  // Usuario no autenticado -> Redirigir a home y pedir login
  return router.createUrlTree(['/'], { queryParams: { login: 'true' } });
};
