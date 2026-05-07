import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

import { JwtPayload, UserRole, SessionState } from './auth.model';
import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly authApi = inject(AuthApiService);

  // Estado interno privado — ahora se inicializa desde sessionStorage si existe
  readonly #session = signal<SessionState | null>(this.loadSession());
  readonly characterId = signal<string | null>(sessionStorage.getItem('characterId'));

  // Señales públicas de solo lectura
  readonly session = this.#session.asReadonly();
  readonly isLoggedIn = computed(() => this.#session() !== null);
  readonly isAdmin = computed(() => this.#session()?.role === 'ADMIN');
  readonly username = computed(() => this.#session()?.username ?? '');
  readonly userId = computed(() => this.#session()?.userId ?? '');

  private loadSession(): SessionState | null {
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;
    
    const payload = this.#parseJwt(token);
    if (!payload) return null;

    return {
      username: payload.username,
      userId: payload.sub,
      role: payload.role,
      token,
    };
  }

  /**
   * Establece la sesión tras recibir el JWT del Middle Server.
   * Parsea el payload para extraer username (de sub) y role.
   */
  setSession(token: string): void {
    const payload = this.#parseJwt(token);
    if (payload === null) return;

    this.#session.set({
      username: payload.username,
      userId: payload.sub,
      role: payload.role,
      token,
    });

    sessionStorage.setItem('authToken', token);
  }

  /**
   * Limpia la sesión (logout) y redirige a la home.
   */
  clearSession(): void {
    this.#session.set(null);
    this.characterId.set(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('characterId');
    sessionStorage.removeItem('gameContext');
    this.router.navigate(['/']);
  }

  /**
   * Establece el ID del personaje activo para la partida actual.
   */
  setCharacterId(id: string): void {
    this.characterId.set(id);
    sessionStorage.setItem('characterId', id);
  }

  /**
   * Devuelve el token JWT actual, o null si no hay sesión.
   */
  getToken(): string | null {
    return this.#session()?.token ?? null;
  }

  /**
   * ESTADOS DE DEBUG — PARA TESTING LOCAL SOLAMENTE
   * Permiten simular estados de sesión sin un backend real.
   */
  mockLogin(role: UserRole = 'USER'): void {
    this.#session.set({
      username: role === 'ADMIN' ? 'DebugAdmin' : 'Ragnar_Fury',
      userId: 'mock-user-id-' + Math.random().toString(36).substring(7),
      role: role,
      token: 'mock-jwt-token-for-debug',
    });
  }

  mockLogout(): void {
    this.clearSession();
  }

  /**
   * Llama al endpoint POST /api/login del Middle Server.
   * Recibe el JWT, lo parsea y establece la sesión de usuario.
   */
  login(username: string, password: string): Observable<void> {
    return this.authApi.login(username, password).pipe(
      map(({ token }) => {
        this.setSession(token);
      })
    );
  }

  /**
   * Llama al endpoint POST /api/register del Middle Server.
   * Recibe el JWT, lo parsea y establece la sesión de usuario.
   */
  register(username: string, email: string, password: string): Observable<void> {
    return this.authApi.register(username, email, password).pipe(
      map(({ token }) => {
        this.setSession(token);
      })
    );
  }

  /**
   * Decodifica el payload base64 del JWT sin verificar la firma.
   * La verificación real ocurre en el Middle Server en cada petición.
   */
  #parseJwt(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // El índice 1 es siempre el payload en un JWT estándar
      const base64 = parts[1]!.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(json) as JwtPayload;
    } catch {
      // JWT malformado — se ignora y no se establece sesión
      return null;
    }
  }
}

