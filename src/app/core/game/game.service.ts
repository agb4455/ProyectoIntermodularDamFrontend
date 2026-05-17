import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from './socket.service';
import { AppConfigService } from '../config/app-config.service';
import { Observable, tap, map, switchMap, throwError, race } from 'rxjs';

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
  latestStateJson: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly socketService = inject(SocketService);
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  // Estado actual de la partida en el cliente
  readonly #gameContext = signal<GameContext | null>(this.loadContext());
  readonly gameContext = this.#gameContext.asReadonly();
  readonly myCharacterId = signal<string | null>(null);

  private loadContext(): GameContext | null {
    const saved = sessionStorage.getItem('gameContext');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing game context from session storage', e);
      }
    }
    return null;
  }

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
    sessionStorage.setItem('gameContext', JSON.stringify(context));
  }

  /**
   * Limpia el contexto al salir de la partida
   */
  clearGameContext(): void {
    this.#gameContext.set(null);
    sessionStorage.removeItem('gameContext');
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
   * Sale de una partida en fase waiting desde el lobby.
   * Emite lobby:leave y espera confirmación lobby:left.
   * Limpia el gameContext si la partida abandonada era la activa.
   */
  leaveGame(gameId: string): Observable<{ gameId: string }> {
    this.socketService.connect();
    this.socketService.emit('lobby:leave', { gameId });

    // Escuchar confirmación o error, race entre los dos
    return race(
      this.socketService.listenOnce('lobby:left'),
      this.socketService.listenOnce('lobby:leave-error').pipe(
        switchMap(err => throwError(() => new Error(err?.message ?? 'Error al salir del lobby')))
      )
    ).pipe(
      tap(() => {
        // Limpiar el contexto si era la partida activa
        const ctx = this.#gameContext();
        if (ctx && (ctx.code === gameId || ctx.code.startsWith(gameId.substring(0, 6)))) {
          this.clearGameContext();
        }
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
