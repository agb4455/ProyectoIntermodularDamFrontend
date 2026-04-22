import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { GameLogEntry } from './attack.types';

@Component({
  selector: 'app-game-log-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe, UpperCasePipe],
  templateUrl: './game-log.modal.html',
  styleUrl: './game-log.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameLogModalComponent {
  // --- Inputs ---
  readonly logs = input.required<GameLogEntry[]>();

  // --- Outputs ---
  readonly closeModal = output<void>();

  protected onClose(): void {
    this.closeModal.emit();
  }

  protected getLogIcon(type: GameLogEntry['type']): string {
    switch (type) {
      case 'attack': return '⚔️';
      case 'train': return '👷';
      case 'research': return '🧪';
      case 'system': return '📜';
      default: return '●';
    }
  }
}
