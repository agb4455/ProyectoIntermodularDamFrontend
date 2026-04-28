import { Injectable, signal, inject } from '@angular/core';
import { SocketService } from './socket.service';

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

  // Estado actual de la partida en el cliente
  readonly #gameContext = signal<GameContext | null>(null);
  readonly gameContext = this.#gameContext.asReadonly();

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
