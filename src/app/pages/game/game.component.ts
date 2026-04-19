import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';

// Tipos del clan para tipado estricto
type ClanId = 'divine' | 'iron' | 'song' | 'fury' | 'rune' | 'death';
type GamePhase = 'PREPARACIÓN' | 'GUERRA' | 'FIN';

interface PlayerNode {
  clan: ClanId;
  username: string;
}

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePageComponent {

  // --- Estado de la partida (llegará vía Socket.IO) ---
  protected readonly currentPhase = signal<GamePhase>('PREPARACIÓN');
  protected readonly health = signal({ current: 3000, max: 3000 });
  protected readonly gold = signal(150);
  protected readonly researchPts = signal(25);

  // --- Info del jugador local ---
  protected readonly username = signal('Ragnar_Fury');
  protected readonly gameCode = signal('3F8A2C');

  // --- Jugadores en el mapa (mock, vendrá del Socket.IO) ---
  protected readonly players = signal<PlayerNode[]>([
    { clan: 'divine', username: 'Divine' },
    { clan: 'iron',   username: 'Iron'   },
    { clan: 'song',   username: 'Song'   },
    { clan: 'fury',   username: 'FURY'   },
    { clan: 'rune',   username: 'Rune'   },
    { clan: 'death',  username: 'Death'  },
  ]);

  // --- Acciones de los botones laterales (modales pendientes) ---
  protected openEntrenarTropas(): void {
    // TODO: abrir modal EntrenarTropasModalComponent
  }

  protected openTropas(): void {
    // TODO: abrir modal TropasModalComponent
  }

  protected openArbolTecnologico(): void {
    // TODO: abrir modal ArbolTecnologicoModalComponent
  }

  protected openLog(): void {
    // TODO: abrir modal LogModalComponent
  }

  // --- Acciones de la barra superior ---
  protected openRules(): void {
    // TODO: abrir modal de Reglas del juego
  }

  protected openAbandon(): void {
    // TODO: mostrar confirmación de abandono
  }

  // --- Clic en territorio enemigo ---
  protected onTerritoryClick(player: PlayerNode): void {
    if (this.currentPhase() === 'PREPARACIÓN') return; // Sin ataques en preparación
    // TODO: abrir modal AtacarModalComponent con target = player
  }
}
