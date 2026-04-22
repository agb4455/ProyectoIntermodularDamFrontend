import { Injectable, signal } from '@angular/core';

export interface GameContext {
  code: string;
  clan: string;
  isHost: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
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
  }

  // TODO: Implementar métodos para llamar al servidor:
  // - createGame(clanId): Observable<GameContext>
  // - joinGame(code, clanId): Observable<GameContext>
}
