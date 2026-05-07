import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { AppConfigService } from '../config/app-config.service';
import { Observable, tap, map } from 'rxjs';

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
    this.socketService.connect();
    this.socketService.emit('game:availability', { gameId: code });
    return this.socketService.listenOnce('game:availability-results').pipe(
      map(data => ({ takenClans: data.takenClans }))
    );
  }

  /**
   * Obtiene las partidas del usuario autenticado.
   */
  getMyGames(): Observable<GameResponse[]> {
    this.socketService.connect();
    this.socketService.emit('game:list');
    return this.socketService.listenOnce('game:list-results');
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
    this.socketService.connect();
    this.socketService.emit('game:create', { clanId });
    
    return this.socketService.listenOnce('game:created').pipe(
      tap(game => {
        this.setGameContext({
          code: game.id,
          clan: clanId,
          isHost: true
        });
      })
    );
  }

  /**
   * Se une a una partida existente.
   * Emite el evento join_game y establece el contexto local.
   */
  joinGame(code: string, clanId: string, isHost: boolean = false) {
    this.setGameContext({ code, clan: clanId, isHost });
    this.socketService.connect();
    this.socketService.emit('join_game', { gameId: code, clanId });
  }
}
