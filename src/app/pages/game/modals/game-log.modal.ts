import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLogEntry } from './attack.types';

@Component({
  selector: 'app-game-log-modal',
  standalone: true,
  imports: [CommonModule],
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
