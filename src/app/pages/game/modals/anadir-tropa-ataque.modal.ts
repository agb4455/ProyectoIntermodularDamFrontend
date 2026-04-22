import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Troop } from './attack.types';

/**
 * Modal para seleccionar tropas a añadir al ataque
 * Muestra un grid de tropas disponibles
 * Se pueden seleccionar múltiples tropas con checkmark
 * Botones OK y Cancelar para confirmar o descartar
 */
@Component({
  selector: 'app-anadir-tropa-ataque-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anadir-tropa-ataque.modal.html',
  styleUrl: './anadir-tropa-ataque.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnadirTropaAtaqueModalComponent {
  // --- Inputs ---
  readonly availableTroops = input.required<Troop[]>();
  readonly selectedTroopIds = input.required<string[]>();

  // --- Outputs ---
  readonly troopsSelected = output<string[]>(); // Emite array de IDs seleccionadas
  readonly closeModal = output<void>();

  // --- Estado local (selección temporal dentro del modal) ---
  readonly localSelectedIds = signal<string[]>([]);

  constructor() {
    // Sincronizar el state local con el input cuando cambia
    effect(() => {
      const currentSelected = this.selectedTroopIds();
      this.localSelectedIds.set([...currentSelected]);
    });
  }

  // --- Estado derivado ---
  readonly gridCols = computed(() => {
    const count = this.availableTroops().length;
    return count > 0 ? Math.ceil(Math.sqrt(count)) : 0;
  });

  // --- Métodos ---
  protected onTroopClick(troop: Troop): void {
    // Toggle: añade o quita la tropa de la selección local
    this.localSelectedIds.update((ids) => {
      if (ids.includes(troop.id)) {
        // Ya está seleccionada → eliminarla
        return ids.filter((id) => id !== troop.id);
      } else {
        // No está seleccionada → añadirla
        return [...ids, troop.id];  //mirar que son los ...
      }
    });
  }

  protected isTroopSelected(troopId: string): boolean {
    return this.localSelectedIds().includes(troopId);
  }

  protected getHealthPercentage(troop: Troop): number {
    return (troop.currentHealth / troop.maxHealth) * 100;
  }

  protected onOkClick(): void {
    // Emite el array de IDs y cierra el modal
    this.troopsSelected.emit(this.localSelectedIds());
    this.closeModal.emit();
  }

  protected onCancelClick(): void {
    // Solo cierra sin cambios
    this.localSelectedIds.set([...this.selectedTroopIds()]);
    this.closeModal.emit();
  }

  protected onOverlayClick(): void {
    this.closeModal.emit();
  }
}

