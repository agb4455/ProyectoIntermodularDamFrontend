import {
  Component,
  ChangeDetectionStrategy,
  signal,
  output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { GameService } from '../../../../core/game/game.service';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

// Definición de los 6 clanes disponibles
interface ClanOption {
  id: string;
  name: string;
  archetype: string;
  icon: string;
  available?: boolean;
}

const CLANES: ClanOption[] = [
  { id: 'fury',   name: 'Berserkers', archetype: 'FURY',   icon: '🪓', available: true },
  { id: 'divine', name: 'Valkirias',  archetype: 'DIVINE', icon: '⚡', available: true },
  { id: 'iron',   name: 'Jarls',      archetype: 'IRON',   icon: '🛡️', available: true },
  { id: 'song',   name: 'Skalds',     archetype: 'SONG',   icon: '🎵', available: true },
  { id: 'rune',   name: 'Seidr',      archetype: 'RUNE',   icon: '🌿', available: true },
  { id: 'death',  name: 'Draugr',     archetype: 'DEATH',  icon: '💀', available: true },
];

@Component({
  selector: 'app-unirse-partida-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe, UpperCasePipe],
  templateUrl: './unirse-partida-modal.component.html',
  styleUrl: './unirse-partida-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnirsePartidaModalComponent {
  // Output para notificar al padre que debe cerrar el modal
  readonly closed = output<void>();
  // Output para notificar que la sala está llena
  readonly lobbyFull = output<void>();

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

  // Estado de la verificación del código
  readonly isCodeVerified = signal<boolean>(false);
  readonly isVerifying = signal<boolean>(false);

  // Actualiza el código del juego introducido
  updateCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.gameCode.set(input.value.toUpperCase());
    
    // Si cambia el código, resetear la verificación y clanes
    this.isCodeVerified.set(false);
    this.selectedClan.set(null);
  }

  // Verifica el código contra el servidor y obtiene los clanes disponibles
  verifyCode(): void {
    if (!this.gameCode().trim()) return;
    this.isVerifying.set(true);

    // TODO: Llamar al servidor para obtener los clanes disponibles
    // Ej: const availableClans = await this.gameService.getAvailableClans(this.gameCode());
    
    // Simulación: FURY y RUNE están cogidos
    setTimeout(() => {
      const clanesActualizados = CLANES.map(clan => ({
        ...clan,
        available: clan.id !== 'fury' && clan.id !== 'rune'
      }));
      
      this.clanes.set(clanesActualizados);
      this.isCodeVerified.set(true);
      this.isVerifying.set(false);
    }, 600);
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

    // TODO: Llamar al servidor para validar código y unirse
    // const result = await this.gameService.joinGame(this.gameCode(), this.selectedClan()!);
    // Si el servidor responde que la sala está llena, disparar lobbyFull.emit()

    // Simulación: Establecer contexto como JUGADOR (no host)
    this.gameService.setGameContext({
      code: this.gameCode(),
      clan: this.selectedClan()!,
      isHost: false
    });

    // SIMULACIÓN: Si el código es 'FULL', disparamos el modal de sala llena
    if (this.gameCode() === 'FULL') {
      setTimeout(() => {
        this.isJoining.set(false);
        this.lobbyFull.emit();
      }, 800);
      return;
    }

    setTimeout(() => {
      this.close();
      this.router.navigate(['/game']);
    }, 400);
  }
}
