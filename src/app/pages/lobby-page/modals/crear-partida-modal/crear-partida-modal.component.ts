import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../../../core/game/game.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

// Definición de los 6 clanes disponibles
interface ClanOption {
  id: string;
  name: string;
  archetype: string;
  icon: string; // emoji o SVG inline — se sustituirá por asset real
}

const CLANES: ClanOption[] = [
  { id: 'berserkers',     name: 'Berserkers',     archetype: 'FURY',   icon: '🪓' },
  { id: 'valkirias',      name: 'Valkirias',      archetype: 'DIVINE', icon: '⚡' },
  { id: 'jarls',          name: 'Jarls',          archetype: 'IRON',   icon: '🛡️' },
  { id: 'sombras',        name: 'Sombras',        archetype: 'SHADOW', icon: '🌑' },
  { id: 'frost_guard',    name: 'Frost Guard',    archetype: 'FROST',  icon: '❄️' },
  { id: 'storm_bringers', name: 'Storm Bringers', archetype: 'STORM',  icon: '🌩️' },
];

@Component({
  selector: 'app-crear-partida-modal',
  standalone: true,
  imports: [TranslatePipe],
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

    // TODO: Llamar al servidor para crear partida y obtener el código real
    // const generatedCode = await this.gameService.createGame(this.selectedClan()!);
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
