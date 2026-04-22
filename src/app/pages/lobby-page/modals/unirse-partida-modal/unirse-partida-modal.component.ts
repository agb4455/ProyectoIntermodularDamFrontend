import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../../../core/game/game.service';

// Definición de los 6 clanes disponibles
interface ClanOption {
  id: string;
  name: string;
  archetype: string;
  icon: string;
}

const CLANES: ClanOption[] = [
  { id: 'fury',   name: 'Berserkers', archetype: 'FURY',   icon: '🪓' },
  { id: 'divine', name: 'Valkirias',  archetype: 'DIVINE', icon: '⚡' },
  { id: 'iron',   name: 'Jarls',      archetype: 'IRON',   icon: '🛡️' },
  { id: 'song',   name: 'Skalds',     archetype: 'SONG',   icon: '🎵' },
  { id: 'rune',   name: 'Seidr',      archetype: 'RUNE',   icon: '🌿' },
  { id: 'death',  name: 'Draugr',     archetype: 'DEATH',  icon: '💀' },
];

@Component({
  selector: 'app-unirse-partida-modal',
  standalone: true,
  imports: [],
  templateUrl: './unirse-partida-modal.component.html',
  styleUrl: './unirse-partida-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnirsePartidaModalComponent {
  // Output para notificar al padre que debe cerrar el modal
  readonly closed = output<void>();

  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

  // Lista de clanes disponibles (por ahora todos disponibles según revisión de feedback)
  readonly clanes = signal<ClanOption[]>(CLANES);

  // Código introducido por el usuario
  readonly gameCode = signal<string>('');

  // Clan seleccionado actualmente (null = ninguno)
  readonly selectedClan = signal<string | null>(null);

  // Estado de carga tras pulsar "Entrar en Combate"
  readonly isJoining = signal<boolean>(false);

  // Actualiza el código del juego introducido
  updateCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gameCode.set(input.value.toUpperCase());
  }

  // Selecciona o deselecciona un clan
  selectClan(clanId: string): void {
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

    // Simulación: Establecer contexto como JUGADOR (no host)
    this.gameService.setGameContext({
      code: this.gameCode(),
      clan: this.selectedClan()!,
      isHost: false
    });

    setTimeout(() => {
      this.close();
      this.router.navigate(['/game']);
    }, 400);
  }
}
