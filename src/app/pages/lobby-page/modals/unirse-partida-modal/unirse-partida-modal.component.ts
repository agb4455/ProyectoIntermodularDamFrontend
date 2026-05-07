import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { GameService } from '../../../../core/game/game.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';
import { CLANS_DATA } from '../../../../core/game/clans.data';

// Definición de los 6 clanes disponibles
interface ClanOption {
  id: string;
  name: string;
  archetype: string;
  icon: string;
  available?: boolean;
}

const ARCHETYPE_ICONS: Record<string, string> = {
  FURY: '🪓',
  DIVINE: '⚡',
  IRON: '🛡️',
  SHADOW: '👤',
  FROST: '❄️',
  STORM: '🌩️'
};

@Component({
  selector: 'app-unirse-partida-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe, UpperCasePipe],
  templateUrl: './unirse-partida-modal.component.html',
  styleUrl: './unirse-partida-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnirsePartidaModalComponent implements OnInit {
  // Output para notificar al padre que debe cerrar el modal
  readonly closed = output<void>();
  // Output para notificar que la sala está llena
  readonly lobbyFull = output<void>();

  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

  // Lista de clanes disponibles
  readonly clanes = signal<ClanOption[]>([]);

  ngOnInit(): void {
    const options = CLANS_DATA.map(clan => ({
      id: clan.id,
      name: clan.name,
      archetype: clan.archetype,
      icon: ARCHETYPE_ICONS[clan.archetype] || '⚔️',
      available: true
    }));
    this.clanes.set(options);
  }

  // Código introducido por el usuario
  readonly gameCode = signal<string>('');

  // Clan seleccionado actualmente (null = ninguno)
  readonly selectedClan = signal<string | null>(null);

  // Estado de carga tras pulsar "Entrar en Combate"
  readonly isJoining = signal<boolean>(false);

  // Estado de la verificación del código
  readonly isCodeVerified = signal<boolean>(false);
  readonly isVerifying = signal<boolean>(false);

  // Actualiza el código del juego introducido
  updateCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gameCode.set(input.value);
    
    // Si cambia el código, resetear la verificación y clanes
    this.isCodeVerified.set(false);
    this.selectedClan.set(null);
  }

  // Verifica el código contra el servidor y obtiene los clanes disponibles
  verifyCode(): void {
    if (!this.gameCode().trim()) return;
    this.isVerifying.set(true);

    this.gameService.getGameAvailability(this.gameCode()).subscribe({
      next: (response) => {
        const takenClans = response.takenClans.map(id => id.toUpperCase());
        const clanesActualizados = this.clanes().map(clan => ({
          ...clan,
          available: !takenClans.includes(clan.id.toUpperCase())
        }));
        this.clanes.set(clanesActualizados);
        this.isCodeVerified.set(true);
        this.isVerifying.set(false);
      },
      error: () => {
        // En caso de error (ej: partida no encontrada), resetear
        const clanesReseteados = this.clanes().map(clan => ({ ...clan, available: true }));
        this.clanes.set(clanesReseteados);
        this.isCodeVerified.set(false);
        this.isVerifying.set(false);
      }
    });
  }

  // Selecciona o deselecciona un clan
  selectClan(clanId: string): void {
    const clan = this.clanes().find(c => c.id === clanId);
    if (!clan || !clan.available) return;
    this.selectedClan.update(current => (current === clanId ? null : clanId));
  }

  // Cierra el modal notificando al padre
  close(): void {
    this.closed.emit();
  }

  // Se une a la partida y redirige a lobbyPrevia
  joinGame(): void {
    if (!this.selectedClan() || !this.gameCode().trim()) return;
    this.isJoining.set(true);

    const clanOption = this.clanes().find(c => c.id === this.selectedClan());
    const archetype = clanOption?.archetype || 'FURY';

    // Llamada real al servicio para emitir join_game via socket
    this.gameService.joinGame(this.gameCode(), archetype);

    // Navegamos a la página de juego. El modal se cerrará automáticamente
    // al destruirse el LobbyPageComponent, pero forzamos el cierre por seguridad.
    setTimeout(() => {
      console.log('[UnirsePartida] Navegando a /game...');
      this.router.navigate(['/game']).then(success => {
        if (success) {
          this.close();
        } else {
          console.error('[UnirsePartida] Error al navegar a /game');
          this.isJoining.set(false);
        }
      });
    }, 400);
  }
}
