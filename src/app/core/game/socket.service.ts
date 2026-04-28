import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AppConfigService } from '../config/app-config.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly appConfig = inject(AppConfigService);
  private readonly authService = inject(AuthService);
  
  private socket: Socket | null = null;

  /**
   * Conecta al servidor de WebSockets usando el JWT del usuario actual.
   * Si ya existe una conexión, no crea una nueva (una sesión por usuario).
   */
  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.warn('[SocketService] Intento de conexión sin token JWT. Abortando.');
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
      console.log('[SocketService] Conectado al servidor WebSocket:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Desconectado del servidor WebSocket:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Error de conexión:', error.message);
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
    if (!this.socket?.connected) {
      console.warn(`[SocketService] Intento de emitir evento '${event}' sin estar conectado.`);
      return;
    }
    this.socket.emit(event, payload);
  }

  /**
   * Retorna la instancia actual del socket.
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}
