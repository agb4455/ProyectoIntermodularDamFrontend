import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnemyTarget, Troop, TroopGridCell, ClanId, CLAN_ADVANTAGES, CLAN_NAMES } from './attack.types';
import { AnadirTropaAtaqueModalComponent } from './anadir-tropa-ataque.modal';

/**
 * Modal para atacar a un enemigo
 * Muestra una grilla de tropas seleccionadas y un botón "+" para añadir más
 * Cada celda de la grilla contiene una tropa con su health bar
 */
@Component({
  selector: 'app-atacar-modal',
  standalone: true,
  imports: [CommonModule, AnadirTropaAtaqueModalComponent],
  templateUrl: './atacar.modal.html',
  styleUrl: './atacar.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtacarModalComponent {
  // --- Inputs ---
  readonly target = input.required<EnemyTarget>();
  readonly availableTroops = input.required<Troop[]>();
  readonly localClan = input.required<ClanId>();

  // --- Outputs ---
  readonly closeModal = output<void>();
  readonly launchAttack = output<string[]>(); // IDs de tropas seleccionadas

  // --- Estado local ---
  readonly selectedTroopIds = signal<string[]>([]);
  readonly showAnadirModal = signal(false);

  // --- Estado derivado ---
  readonly troopGrid = computed<TroopGridCell[]>(() => {
    const selectedIds = this.selectedTroopIds();
    const troops = this.availableTroops();
    return selectedIds
      .map((id, idx) => {
        const troop = troops.find((t) => t.id === id);
        return troop
          ? { troopId: id, position: idx, troop }
          : null;
      })
      .filter((cell): cell is TroopGridCell => cell !== null);
  });

  readonly gridCols = computed(() => {
    const count = this.troopGrid().length;
    return count > 0 ? Math.ceil(Math.sqrt(count)) : 0;
  });

  readonly canLaunchAttack = computed(() => this.selectedTroopIds().length > 0);

  readonly advantageState = computed(() => {
    const attackerClan = this.localClan();
    const defenderClan = this.target().clan;

    if (CLAN_ADVANTAGES[attackerClan] === defenderClan) {
      return {
        type: 'advantage' as const,
        message: `¡VENTAJA TÁCTICA! Tus tropas infligen un 50% más de daño a los ${CLAN_NAMES[defenderClan]}.`,
        icon: '⚡'
      };
    } else if (CLAN_ADVANTAGES[defenderClan] === attackerClan) {
      return {
        type: 'disadvantage' as const,
        message: `¡CUIDADO! El clan ${CLAN_NAMES[defenderClan]} tiene ventaja defensiva sobre ti (daño reducido).`,
        icon: '🛡️'
      };
    }
    return null;
  });

  // --- Métodos ---
  protected onAddTroopClick(): void {
    this.showAnadirModal.set(true);
  }

  protected onRemoveTroop(troopId: string): void {
    this.selectedTroopIds.update((ids) => ids.filter((id) => id !== troopId));
  }

  protected onAttackClick(): void {
    if (this.canLaunchAttack()) {
      this.launchAttack.emit(this.selectedTroopIds());
      this.selectedTroopIds.set([]);
      this.showAnadirModal.set(false);
    }
  }

  protected onModalClose(): void {
    this.showAnadirModal.set(false);
  }

  protected onTroopSelected(newTroopIds: string[]): void {
    // Se emite un array de IDs desde el modal de selección
    // Añadirlas a las ya seleccionadas (evitando duplicados)
    this.selectedTroopIds.update((ids) => {
      const combined = [...ids];
      for (const troopId of newTroopIds) {
        if (!combined.includes(troopId)) {
          combined.push(troopId);
        }
      }
      return combined;
    });
    this.showAnadirModal.set(false);
  }

  protected isTroopSelected(troopId: string): boolean {
    return this.selectedTroopIds().includes(troopId);
  }

  protected getHealthPercentage(troop: Troop): number {
    return (troop.currentHealth / troop.maxHealth) * 100;
  }

  protected closeAtacarModal(): void {
    this.closeModal.emit();
  }
}
