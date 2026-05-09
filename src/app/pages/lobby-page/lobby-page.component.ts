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
  isHost: boolean;
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
          .map(g => {
            let isHost = false;
            let clan = 'fury';
            let clanName = 'Viking Clan';

            // Intentar extraer info real del estado persistido
            if (g.latestStateJson) {
              try {
                const state = JSON.parse(g.latestStateJson);
                const myUserId = this.authService.userId();
                const myPlayer = Object.values(state.players || {}).find((p: any) => p.userId === myUserId) as any;
                
                if (myPlayer) {
                  isHost = !!myPlayer.isHost;
                  clan = (myPlayer.clanId || 'berserkers').toLowerCase();
                  // Mapeo inverso de ID a nombre legible si es necesario
                  const clanNames: Record<string, string> = {
                    'berserkers': 'Berserkers',
                    'valkirias': 'Valkirias',
                    'jarls': 'Jarls de Hierro',
                    'sombras': 'Sombras de Loki',
                    'frost_guard': 'Guardianes del Hielo',
                    'storm_bringers': 'Portadores de la Tormenta'
                  };
                  clanName = clanNames[clan] || (clan.charAt(0).toUpperCase() + clan.slice(1));
                }
              } catch (e) {
                console.warn('Error parsing latestStateJson for game', g.id, e);
              }
            }
            
            // Si no pudimos determinar isHost desde el JSON (o no hay JSON), usar participants
            if (!g.latestStateJson || !isHost) {
              const myCharId = this.authService.characterId();
              const myParticipant = g.participants?.find(p => p.characterId === myCharId);
              if (myParticipant) {
                isHost = myParticipant.joinOrder === 1;
              } else if (g.participants?.length === 1) {
                // Fallback de emergencia: si solo hay uno, es el host
                isHost = true;
              }
            }

            return {
              id: g.id,
              name: `War ${g.id.substring(0, 4)}`,
              code: g.id.substring(0, 6).toUpperCase(),
              clan: clan,
              clanName: clanName,
              isHost: isHost // Guardamos este dato para usarlo en onEnterGame
            };
          });

        this.activeGames.set(active);
        const finishedGamesList: FinishedGameModel[] = games
          .filter(g => g.status === 'FINISHED')
          .map(g => {
            const myCharId = this.authService.characterId();
            const isWinner = g.winnerCharacterId === myCharId;
            
            return {
              id: g.id,
              name: `Legacy ${g.id.substring(0, 4)}`,
              code: g.id.substring(0, 6).toUpperCase(),
              result: isWinner ? 'VICTORY' : 'DEFEAT'
            };
          });

        this.finishedGames.set(finishedGamesList);
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
    const game = this.activeGames().find(g => g.id === gameId);
    if (game) {
      // Unirse formalmente a la partida pasando el flag de host si corresponde
      this.gameService.joinGame(game.id, game.clan, game.isHost);
      // Navegar a la página del juego
      this.router.navigate(['/game']);
    }
  }

  onLeaveGame(gameId: string) {
    if (confirm(this.i18n.translate('LOBBY.MESSAGES.CONFIRM_LEAVE'))) {
      // Comunicar el abandono al servidor antes de actualizar la UI
      this.gameService.leaveGame(gameId).subscribe({
        next: () => {
          // Eliminar la tarjeta del listado local solo tras confirmación del servidor
          this.activeGames.update(games => games.filter(g => g.id !== gameId));
        },
        error: (err) => {
          // La partida posiblemente ya inició: informar al usuario
          alert(this.i18n.translate('LOBBY.MESSAGES.LEAVE_ERROR'));
        }
      });
    }
  }

  onViewStats(gameId: string) {
    this.router.navigate(['/stats/game']);
  }

  onDeleteFinished(gameId: string) {
    this.finishedGames.update(games => games.filter(g => g.id !== gameId));
  }
}
