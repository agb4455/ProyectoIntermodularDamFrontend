import { Component, ChangeDetectionStrategy, input, output, computed, inject } from '@angular/core';
import { PlayerNode } from '../game.model';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-lobby-modal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './lobby.modal.html',
  styleUrl: './lobby.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LobbyModalComponent {
  // Inputs requeridos
  readonly gameCode = input.required<string>();
  readonly players = input.required<PlayerNode[]>();
  readonly isHost = input.required<boolean>();

  private readonly i18n: I18nService = inject(I18nService);

  // Notifica que el anfitrión ha pulsado iniciar
  readonly startGame = output<void>();

  // Notifica clic en un jugador de la lista
  readonly playerClick = output<PlayerNode>();

  // Lógica de validación
  protected readonly canStart = computed(() => this.players().length >= 2);
  
  // Mensaje de error si hay pocos jugadores
  protected readonly errorMessage = computed(() => 
    this.players().length < 2 ? this.i18n.translate('GAME.MODALS.WAITING.MIN_PLAYERS') : null
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
