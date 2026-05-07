import { Component, ChangeDetectionStrategy, input, output, signal, effect } from '@angular/core';
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

  // --- Estado local ---
  readonly autoScroll = signal(true);
  readonly filteredType = signal<GameLogEntry['type'] | 'all'>('all');

  // --- Logs filtrados y animados ---
  readonly displayedLogs = signal<GameLogEntry[]>([]);

  constructor() {
    // Reactivo: actualizar logs mostrados cuando cambia el filtro o la lista
    effect(() => {
      const allLogs = this.logs();
      const filter = this.filteredType();
      
      if (filter === 'all') {
        this.displayedLogs.set(allLogs);
      } else {
        this.displayedLogs.set(allLogs.filter(log => log.type === filter));
      }

      // Auto-scroll al final si está habilitado
      if (this.autoScroll()) {
        setTimeout(() => {
          const container = document.querySelector('.logs-list');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 0);
      }
    });
  }

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

  protected setFilter(type: GameLogEntry['type'] | 'all'): void {
    this.filteredType.set(type);
  }

  protected toggleAutoScroll(): void {
    this.autoScroll.update(v => !v);
  }

  protected clearLogs(): void {
    // Nota: en un caso real, esto sería confirmado con el usuario
    // Por ahora, solo es visual (el real está en el servidor)
    console.log('[LOG] Clear logs - requiere confirmación del servidor');
  }
}
