import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CrearPartidaModalComponent } from './modals/crear-partida-modal/crear-partida-modal.component';
import { UnirsePartidaModalComponent } from './modals/unirse-partida-modal/unirse-partida-modal.component';
import { SalaLlenaModalComponent } from './modals/sala-llena-modal/sala-llena-modal.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { I18nService } from '../../core/i18n/i18n.service';

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
  result: 'VICTORY' | 'DEFEAT';
}

@Component({
  selector: 'app-lobby-page',
  standalone: true,
  imports: [CrearPartidaModalComponent, UnirsePartidaModalComponent, SalaLlenaModalComponent, TranslatePipe, UpperCasePipe],
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
    { id: 'f1', name: 'Guerra del Invierno', code: 'W2N4-P', result: 'VICTORY' },
    { id: 'f2', name: 'Conflicto de Sangre', code: 'B8V1-X', result: 'DEFEAT' }
  ]);

  // Estado de la pestaña activa
  readonly activeTab = signal<'active' | 'finished'>('active');

  // Estado de visibilidad de modales
  readonly showCrearPartida = signal<boolean>(false);
  readonly showUnirsePartida = signal<boolean>(false);
  readonly showSalaLlena = signal<boolean>(false);

  // Nombre del usuario autenticado
  private readonly authService = inject(AuthService);
  private readonly i18n = inject(I18nService);
  readonly username = this.authService.username;

  constructor(private router: Router) {}

  setTab(tab: 'active' | 'finished') {
    this.activeTab.set(tab);
  }

  // Action Methods
  
  onNewGame() {
    this.showCrearPartida.set(true);
  }

  onJoinGame() {
    this.showUnirsePartida.set(true);
  }

  onLobbyFull() {
    this.showUnirsePartida.set(false);
    this.showSalaLlena.set(true);
  }

  onEnterGame(gameId: string) {
    // Navigate to game page
    this.router.navigate(['/game']);
  }

  onLeaveGame(gameId: string) {
    if (confirm(this.i18n.translate('LOBBY.MESSAGES.CONFIRM_LEAVE'))) {
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
