import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { AppConfigService } from '../config/app-config.service';
import { Observable, tap } from 'rxjs';

export interface GameContext {
  code: string;
  clan: string;
  isHost: boolean;
}

export interface GameResponse {
  id: string;
  status: string;
  maxPlayers: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  winnerCharacterId?: string;
  participants: any[];
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
   * Obtiene las partidas del usuario autenticado.
   */
  getMyGames(): Observable<GameResponse[]> {
    return this.http.get<GameResponse[]>(
      `${this.config.config.middleServerUrl}/api/games/my-games`
    );
  }

  /**
   * Establece el contexto de la partida antes de entrar
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

  /**
   * Crea una nueva partida en el servidor.
   */
  createGame(clanId: string): Observable<GameResponse> {
    return this.http.post<GameResponse>(
      `${this.config.config.middleServerUrl}/api/games`,
      { clanId }
    ).pipe(
      tap(game => {
        this.setGameContext({
          code: game.id,
          clan: clanId,
          isHost: true
        });
        this.socketService.connect();
        this.socketService.emit('join_game', { gameId: game.id });
      })
    );
  }

  /**
   * Se une a una partida existente.
   * TODO: Implementar POST /api/games/join en el Middle Server si fuera necesario,
   * por ahora usamos el flujo de socket directo.
   */
  joinGame(code: string, clanId: string) {
    this.setGameContext({ code, clan: clanId, isHost: false });
    this.socketService.connect();
    this.socketService.emit('join_game', { gameId: code });
  }
}
