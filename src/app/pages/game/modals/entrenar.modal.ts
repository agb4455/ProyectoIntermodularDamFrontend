import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TroopType, TrainableTroopOption } from './attack.types';

/**
 * Modal para el entrenamiento de nuevas tropas
 * Muestra las opciones disponibles según el árbol tecnológico y permite comprarlas
 */
@Component({
  selector: 'app-entrenar-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entrenar.modal.html',
  styleUrl: './entrenar.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntrenarModalComponent {
  // --- Inputs ---
  readonly gold = input.required<number>();
  readonly options = input.required<TrainableTroopOption[]>();

  // --- Outputs ---
  readonly closeModal = output<void>();
  readonly train = output<TroopType>();

  // --- Métodos ---
  protected onTrainClick(option: TrainableTroopOption): void {
    if (this.canAfford(option)) {
      this.train.emit(option.type);
    }
  }

  protected canAfford(option: TrainableTroopOption): boolean {
    return this.gold() >= option.cost;
  }

  protected onCloseClick(): void {
    this.closeModal.emit();
  }
}
