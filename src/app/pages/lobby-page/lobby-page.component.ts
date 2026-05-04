import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { GameService } from '../../core/game/game.service';
import { CrearPartidaModalComponent } from './modals/crear-partida-modal/crear-partida-modal.component';
import { UnirsePartidaModalComponent } from './modals/unirse-partida-modal/unirse-partida-modal.component';
import { SalaLlenaModalComponent } from './modals/sala-llena-modal/sala-llena-modal.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { I18nService } from '../../core/i18n/i18n.service';

interface ActiveGameModel {
  id: string;
  name: string;
  code: string;
  clan: string;
  clanName: string;
}

interface FinishedGameModel {
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
export class LobbyPageComponent implements OnInit {
  // Real data for active games
  readonly activeGames = signal<ActiveGameModel[]>([]);

  // Real data for finished games
  readonly finishedGames = signal<FinishedGameModel[]>([]);

  // Estado de la pestaña activa
  readonly activeTab = signal<'active' | 'finished'>('active');

  // Estado de visibilidad de modales
  readonly showCrearPartida = signal<boolean>(false);
  readonly showUnirsePartida = signal<boolean>(false);
  readonly showSalaLlena = signal<boolean>(false);

  // Nombre del usuario autenticado
  private readonly authService = inject(AuthService);
  private readonly gameService = inject(GameService);
  private readonly i18n = inject(I18nService);
  readonly username = this.authService.username;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getMyGames().subscribe({
      next: (games) => {
        const active = games
          .filter(g => g.status !== 'FINISHED')
          .map(g => ({
            id: g.id,
            name: `War ${g.id.substring(0, 4)}`,
            code: g.id.substring(0, 6).toUpperCase(),
            clan: 'fury', // TODO: Obtener el clan real del participante
            clanName: 'Viking Clan'
          }));

        const finished = games
          .filter(g => g.status === 'FINISHED')
          .map(g => ({
            id: g.id,
            name: `Legacy ${g.id.substring(0, 4)}`,
            code: g.id.substring(0, 6).toUpperCase(),
            result: 'VICTORY' as const // TODO: Determinar victoria/derrota real
          }));

        this.activeGames.set(active);
        this.finishedGames.set(finished);
      },
      error: (err) => console.error('Error loading games:', err)
    });
  }

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
