import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';

interface ActiveGameMock {
  id: string;
  name: string;
  code: string;
  clan: string;
  clanName: string;
}

interface FinishedGameMock {
  id: string;
  name: string;
  code: string;
  result: 'Victoria' | 'Derrota';
}

@Component({
  selector: 'app-lobby-page',
  standalone: true,
  imports: [],
  templateUrl: './lobby-page.component.html',
  styleUrl: './lobby-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyPageComponent {
  // Mock data for active games
  readonly activeGames = signal<ActiveGameMock[]>([
    { id: '1', name: 'Batalla por Midgard', code: 'A7X9-B', clan: 'fury', clanName: 'Berserkers' },
    { id: '2', name: 'El Asedio de Valhalla', code: 'K9M2-Z', clan: 'rune', clanName: 'Seidr' }
  ]);

  // Mock data for finished games
  readonly finishedGames = signal<FinishedGameMock[]>([
    { id: 'f1', name: 'Guerra del Invierno', code: 'W2N4-P', result: 'Victoria' },
    { id: 'f2', name: 'Conflicto de Sangre', code: 'B8V1-X', result: 'Derrota' }
  ]);

  // UI state
  readonly finishedGamesCollapsed = signal<boolean>(false);

  constructor(private router: Router) {}

  toggleFinishedGames() {
    this.finishedGamesCollapsed.update(v => !v);
  }

  // Action Methods (To be implemented with real logic/modals later)
  
  onNewGame() {
    alert('Abrir modal de Crear Partida (Por implementar)');
  }

  onJoinGame() {
    alert('Abrir modal de Unirse a Partida (Por implementar)');
  }

  onEnterGame(gameId: string) {
    // Navigate to game page
    this.router.navigate(['/game']);
  }

  onLeaveGame(gameId: string) {
    if (confirm('¿Estás seguro de que quieres abandonar esta partida? Perderás automáticamente.')) {
      this.activeGames.update(games => games.filter(g => g.id !== gameId));
    }
  }

  onViewStats(gameId: string) {
    this.router.navigate(['/stats/game']);
  }

  onDeleteFinished(gameId: string) {
    this.finishedGames.update(games => games.filter(g => g.id !== gameId));
  }
}
