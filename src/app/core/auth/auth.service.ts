import { Injectable, signal, computed } from '@angular/core';

// Payload decodificado del JWT emitido por el Middle Server
interface JwtPayload {
  sub: string;        // username del usuario
  role: UserRole;     // rol del usuario
  iat: number;        // issued at
  exp: number;        // expiration
}

// Roles posibles según la arquitectura del proyecto
export type UserRole = 'USER' | 'ADMIN';

// Estado de sesión que expone el servicio
export interface SessionState {
  username: string;
  role: UserRole;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Estado interno privado — el token se guarda solo en memoria (nunca en localStorage)
  readonly #session = signal<SessionState | null>(null);

  // Señales públicas de solo lectura
  readonly session = this.#session.asReadonly();
  readonly isLoggedIn = computed(() => this.#session() !== null);
  readonly isAdmin = computed(() => this.#session()?.role === 'ADMIN');
  readonly username = computed(() => this.#session()?.username ?? '');

  /**
   * Establece la sesión tras recibir el JWT del Middle Server.
   * Parsea el payload para extraer username y role.
   */
  setSession(token: string): void {
    const payload = this.#parseJwt(token);
    if (payload === null) return;

    this.#session.set({
      username: payload.sub,
      role: payload.role,
      token,
    });
  }

  /**
   * Limpia la sesión (logout).
   */
  clearSession(): void {
    this.#session.set(null);
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
      role: role,
      token: 'mock-jwt-token-for-debug',
    });
  }

  mockLogout(): void {
    this.clearSession();
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
