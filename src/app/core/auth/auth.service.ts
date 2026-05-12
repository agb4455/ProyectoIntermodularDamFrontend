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

  /** Timer para la renovación proactiva del token */
  private refreshTimer?: any;

  // Señales públicas de solo lectura
  readonly session = this.#session.asReadonly();
  readonly isLoggedIn = computed(() => this.#session() !== null);
  readonly isAdmin = computed(() => this.#session()?.role === 'ADMIN');
  readonly username = computed(() => this.#session()?.username ?? '');
  readonly userId = computed(() => this.#session()?.userId ?? '');
  readonly avatarUrl = computed(() => {
    const s = this.#session();
    return s ? (s as SessionState).avatarUrl ?? '' : '';
  });

  private loadSession(): SessionState | null {
    const token = sessionStorage.getItem('authToken');
    if (!token) return null;
    
    const payload = this.#parseJwt(token);
    if (!payload) return null;

    const session: SessionState = {
      username: payload.username,
      userId: payload.sub,
      role: payload.role,
      token,
      avatarUrl: sessionStorage.getItem('avatarUrl') ?? undefined,
    };

    // Si hay sesión al cargar, programar la renovación
    this.scheduleTokenRefresh(token);
    return session;
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
      avatarUrl: undefined, // Se cargará después via getProfile si no existe
    });

    sessionStorage.setItem('authToken', token);

    // Programar la renovación proactiva
    this.scheduleTokenRefresh(token);
  }

  /**
   * Actualiza la URL del avatar en la sesión actual y en el almacenamiento persistente.
   */
  updateAvatarUrl(avatarUrl: string): void {
    const current = this.#session();
    if (current) {
      this.#session.set({ ...current, avatarUrl });
      sessionStorage.setItem('avatarUrl', avatarUrl);
    }
  }

  /**
   * Limpia la sesión (logout) y redirige a la home.
   */
  clearSession(): void {
    this.#session.set(null);
    this.characterId.set(null);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('avatarUrl');
    sessionStorage.removeItem('characterId');
    sessionStorage.removeItem('gameContext');
    
    // Cancelar cualquier renovación programada
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

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
   * Llama al endpoint POST /api/login del Middle Server.
   * Recibe el JWT, lo parsea y establece la sesión de usuario.
   * Carga el perfil inmediatamente para obtener el avatar.
   */
  login(username: string, password: string): Observable<void> {
    return this.authApi.login(username, password).pipe(
      map(({ token }) => {
        this.setSession(token);
        this.syncProfile(); // Carga asíncrona del perfil
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
        this.syncProfile();
      })
    );
  }

  /**
   * Sincroniza los datos del perfil (email, avatar) con el servidor.
   */
  private syncProfile(): void {
    this.authApi.getProfile().subscribe({
      next: (profile) => {
        if (profile.avatarUrl) {
          this.updateAvatarUrl(profile.avatarUrl);
        }
      },
      error: (err) => {
        console.error('[AuthService] Error syncing profile:', err);
      }
    });
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

  /**
   * Programa la renovación automática del token antes de que expire.
   * Basado en el campo 'exp' del JWT (seguridad proactiva).
   */
  private scheduleTokenRefresh(token: string): void {
    // Cancelar cualquier timer previo
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const payload = this.#parseJwt(token);
    if (!payload || !payload.exp) return;

    const expiresAtMs = payload.exp * 1000;
    const nowMs = Date.now();
    
    // Renovar 5 minutos antes de expirar (o inmediatamente si ya está cerca)
    const marginMs = 5 * 60 * 1000;
    const timeoutMs = expiresAtMs - nowMs - marginMs;

    if (timeoutMs <= 0) {
      // Si el token está a punto de expirar o ya expiró, intentamos renovar ya
      this.executeRefresh();
    } else {
      this.refreshTimer = setTimeout(() => this.executeRefresh(), timeoutMs);
    }
  }

  /**
   * Ejecuta la llamada al API para obtener un nuevo token.
   */
  private executeRefresh(): void {
    if (!this.isLoggedIn()) return;

    this.authApi.refreshToken().subscribe({
      next: (res) => {
        console.log('[AuthService] Token renovado automáticamente');
        this.setSession(res.token);
      },
      error: (err) => {
        console.error('[AuthService] Fallo en renovación de token:', err);
        // Si el refresh falla (ej. usuario baneado o server caído), no forzamos logout inmediato,
        // pero el usuario eventualmente recibirá 401 en otras peticiones.
      }
    });
  }
}

