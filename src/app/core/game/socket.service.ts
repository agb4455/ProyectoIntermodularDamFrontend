import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AppConfigService } from '../config/app-config.service';
import { AuthService } from '../auth/auth.service';
import { I18nService } from '../i18n/i18n.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly appConfig = inject(AppConfigService);
  private readonly authService = inject(AuthService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  
  private socket: Socket | null = null;

  /**
   * Conecta al servidor de WebSockets usando el JWT del usuario actual.
   * Si ya existe una conexión, no crea una nueva (una sesión por usuario).
   */
  connect(): void {
    if (this.socket) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      // console.warn('[SocketService] Intento de conexión sin token JWT. Abortando.');
      return;
    }

    const url = this.appConfig.config.middleServerUrl;

    this.socket = io(url, {
      auth: { token }, // El Middle Server en auth.js espera handshake.auth.token
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true
    });

    this.socket.on('connect', () => {
      // console.log('[SocketService] Conectado al servidor WebSocket:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason: string) => {
      // console.log('[SocketService] Desconectado del servidor WebSocket:', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      // console.error('[SocketService] Error de conexión:', error.message);
    });

    // Escuchar baneo del usuario
    this.socket.on('user:banned', () => {
      const message = this.i18n.translate('GAME.BANNED_MESSAGE');
      window.alert(message);
      this.authService.clearSession();
      this.disconnect();
      this.router.navigate(['/']);
    });
  }

  /**
   * Desconecta del servidor WebSocket.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Emite un evento al servidor.
   */
  emit(event: string, payload?: any): void {
    if (!this.socket) {
      // console.warn(`[SocketService] Intento de emitir evento '${event}' sin inicializar el socket.`);
      return;
    }
    // No bloqueamos si no está conectado aún, dejamos que socket.io lo bufferee
    this.socket.emit(event, payload);
  }

  listen(event: string): Observable<any> {
    return new Observable(subscriber => {
      this.socket?.on(event, (data) => subscriber.next(data));
    });
  }

  /**
   * Escucha un evento una sola vez y completa.
   */
  listenOnce(event: string): Observable<any> {
    return new Observable(subscriber => {
      this.socket?.once(event, (data) => {
        subscriber.next(data);
        subscriber.complete();
      });
    });
  }

  /**
   * Retorna la instancia actual del socket.
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}
