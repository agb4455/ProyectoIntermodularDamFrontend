import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { AppConfigService } from '../config/app-config.service';
import { Observable } from 'rxjs';

export interface GameContext {
  code: string;
  clan: string;
  isHost: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly socketService = inject(SocketService);
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  // Estado actual de la partida en el cliente
  readonly #gameContext = signal<GameContext | null>(null);
  readonly gameContext = this.#gameContext.asReadonly();

  /**
   * Obtiene los clanes ya ocupados en una partida.
   */
  getGameAvailability(code: string): Observable<{ takenClans: string[] }> {
    return this.http.get<{ takenClans: string[] }>(
      `${this.config.config.middleServerUrl}/api/games/${code}/availability`
    );
  }

  /**
   * Establece el contexto de la partida antes de entrar
   * TODO: Integrar con el Middle Server para validar códigos y obtener estado real
   */
  setGameContext(context: GameContext): void {
    this.#gameContext.set(context);
  }

  /**
   * Limpia el contexto al salir de la partida
   */
  clearGameContext(): void {
    this.#gameContext.set(null);
    this.socketService.disconnect();
  }

  // TODO: Implementar llamadas reales al backend que devuelvan Observable<GameContext>.
  // Por ahora, simulamos las peticiones conectando el socket y seteando un contexto falso.

  createGame(clanId: string) {
    this.socketService.connect();
    // Simulate backend response
    const mockContext: GameContext = { code: 'NEW-GAME', clan: clanId, isHost: true };
    this.setGameContext(mockContext);
    this.socketService.emit('join_game', { gameId: mockContext.code });
  }

  joinGame(code: string, clanId: string) {
    this.socketService.connect();
    // Simulate backend response
    const mockContext: GameContext = { code, clan: clanId, isHost: false };
    this.setGameContext(mockContext);
    this.socketService.emit('join_game', { gameId: mockContext.code });
  }
}
