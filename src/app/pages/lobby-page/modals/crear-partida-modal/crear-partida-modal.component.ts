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
  icon: string; // emoji o SVG inline — se sustituirá por asset real
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
  selector: 'app-crear-partida-modal',
  standalone: true,
  imports: [],
  templateUrl: './crear-partida-modal.component.html',
  styleUrl: './crear-partida-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearPartidaModalComponent {
  // Output para notificar al padre que debe cerrar el modal
  readonly closed = output<void>();

  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

  // Lista de clanes disponibles
  readonly clanes = signal<ClanOption[]>(CLANES);

  // Clan seleccionado actualmente (null = ninguno)
  readonly selectedClan = signal<string | null>(null);

  // Estado de carga tras pulsar "Crear Partida"
  readonly isCreating = signal<boolean>(false);

  // Selecciona o deselecciona un clan
  selectClan(clanId: string): void {
    this.selectedClan.update(current => (current === clanId ? null : clanId));
  }

  // Cierra el modal notificando al padre
  close(): void {
    this.closed.emit();
  }

  // Crea la partida y redirige a lobbyPrevia
  createGame(): void {
    if (!this.selectedClan()) return;
    this.isCreating.set(true);

    // Simulación: Generar un código aleatorio y establecer contexto como HOST
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    this.gameService.setGameContext({
      code: generatedCode,
      clan: this.selectedClan()!,
      isHost: true
    });

    setTimeout(() => {
      this.close();
      this.router.navigate(['/game']);
    }, 400);
  }
}
