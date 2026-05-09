import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Troop } from './attack.types';

/**
 * Modal para visualizar las tropas de un territorio o jugador
 * Muestra una grilla de tropas con sus barras de vida, sin opciones de edición
 */
@Component({
  selector: 'app-visualizar-tropas-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './visualizar-tropas.modal.html',
  styleUrl: './visualizar-tropas.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualizarTropasModalComponent {
  // --- Inputs ---
  readonly title = input.required<string>();
  readonly troops = input.required<Troop[]>();

  // --- Outputs ---
  readonly closeModal = output<void>();

  // --- Estado derivado ---
  protected readonly sortedTroops = computed(() => {
    return [...this.troops()].sort((a, b) => {
      // 1. Listas primero (!isTraining)
      // 2. En entrenamiento después (isTraining)
      //    (Dentro del entrenamiento, orden cronológico de llegada/ID)

      if (!a.isTraining && b.isTraining) return -1;
      if (a.isTraining && !b.isTraining) return 1;
      return 0;
    });
  });

  protected readonly activeTrainingId = computed(() => {
    const training = this.troops().filter(t => t.isTraining);
    return training.length > 0 ? training[0].id : null;
  });

  // --- Métodos ---
  protected getTroopStatus(troop: Troop): 'READY' | 'TRAINING' | 'QUEUED' | 'DEPLOYED' {
    if (troop.deployed) return 'DEPLOYED';
    if (!troop.isTraining) return 'READY';
    return troop.id === this.activeTrainingId() ? 'TRAINING' : 'QUEUED';
  }

  protected getTrainingProgress(troop: Troop): number {
    return troop.trainingProgress ?? 0;
  }
  protected getHealthPercentage(troop: Troop): number {
    return (troop.currentHealth / troop.maxHealth) * 100;
  }

  protected onCloseClick(): void {
    this.closeModal.emit();
  }
}
