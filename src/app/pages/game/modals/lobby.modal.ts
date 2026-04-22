import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { PlayerNode } from '../game.model';

@Component({
  selector: 'app-lobby-modal',
  standalone: true,
  imports: [],
  templateUrl: './lobby.modal.html',
  styleUrl: './lobby.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyModalComponent {
  // Inputs requeridos
  readonly gameCode = input.required<string>();
  readonly players = input.required<PlayerNode[]>();
  readonly isHost = input.required<boolean>();

  // Notifica que el anfitrión ha pulsado iniciar
  readonly startGame = output<void>();

  // Notifica clic en un jugador de la lista
  readonly playerClick = output<PlayerNode>();

  // Lógica de validación
  protected readonly canStart = computed(() => this.players().length >= 2);
  
  // Mensaje de error si hay pocos jugadores
  protected readonly errorMessage = computed(() => 
    this.players().length < 2 ? 'Se necesitan al menos 2 guerreros para zarpar' : null
  );

  protected onStartClick(): void {
    if (this.canStart()) {
      this.startGame.emit();
    }
  }

  protected onPlayerClick(player: PlayerNode): void {
    this.playerClick.emit(player);
  }
}
