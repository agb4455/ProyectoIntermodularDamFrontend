import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { EnemyTarget, Troop, TroopGridCell, ClanId, CLAN_ADVANTAGES } from './attack.types';
import { AnadirTropaAtaqueModalComponent } from './anadir-tropa-ataque.modal';

/**
 * Modal para atacar a un enemigo
 * Muestra una grilla de tropas seleccionadas con animaciones y feedback visual
 * Cada celda de la grilla contiene una tropa con su health bar
 * Soporta cálculo hexagonal de ventajas de clan (1.5x multiplicador)
 */
@Component({
  selector: 'app-atacar-modal',
  standalone: true,
  imports: [CommonModule, AnadirTropaAtaqueModalComponent, TranslatePipe],
  templateUrl: './atacar.modal.html',
  styleUrl: './atacar.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AtacarModalComponent {
  // --- Inputs ---
  readonly target = input.required<EnemyTarget>();
  readonly availableTroops = input.required<Troop[]>();
  readonly localClan = input.required<ClanId>();

  private readonly i18n: I18nService = inject(I18nService);

  // --- Outputs ---
  readonly closeModal = output<void>();
  readonly launchAttack = output<string[]>(); // IDs de tropas seleccionadas

  // --- Constantes de paginación ---
  private readonly PAGE_SIZE = 6;

  // --- Estado local ---
  readonly selectedTroopIds = signal<string[]>([]);
  readonly showAnadirModal = signal(false);
  readonly showDamagePreview = signal(false);
  readonly currentPage = signal(0);

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

  // Número total de páginas según el grid completo
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.troopGrid().length / this.PAGE_SIZE))
  );

  // Tropas visibles en la página actual
  readonly pagedTroopGrid = computed<TroopGridCell[]>(() => {
    const page = this.currentPage();
    return this.troopGrid().slice(page * this.PAGE_SIZE, (page + 1) * this.PAGE_SIZE);
  });

  // Visibilidad de controles de paginación
  readonly showPagination = computed(() => this.totalPages() > 1);
  readonly canGoPrev = computed(() => this.currentPage() > 0);
  readonly canGoNext = computed(() => this.currentPage() < this.totalPages() - 1);

  readonly canLaunchAttack = computed(() => this.selectedTroopIds().length > 0);

  // Cálculo del poder de ataque y bonificadores hexagonales
  readonly estimatedDamage = computed(() => {
    const troops = this.troopGrid().map(cell => cell.troop);
    const baseDamage = troops.reduce((sum, t) => sum + t.currentHealth, 0);
    const typeMultiplier = this.getHexagonalMultiplier();
    return Math.floor(baseDamage * typeMultiplier);
  });

  readonly advantageState = computed(() => {
    const attackerClan = this.localClan();
    const defenderClan = this.target().clan;

    if (CLAN_ADVANTAGES[attackerClan] === defenderClan) {
      const multiplier = this.getHexagonalMultiplier();
      return {
        type: 'advantage' as const,
        message: this.i18n.translate('GAME.MODALS.ATTACK.ADVANTAGE', { enemyClan: this.i18n.translate('GAME.CLAN_NAMES.' + defenderClan) }),
        icon: '⚡',
        multiplier: `${multiplier.toFixed(2)}x`
      };
    } else if (CLAN_ADVANTAGES[defenderClan] === attackerClan) {
      return {
        type: 'disadvantage' as const,
        message: this.i18n.translate('GAME.MODALS.ATTACK.DISADVANTAGE', { enemyClan: this.i18n.translate('GAME.CLAN_NAMES.' + defenderClan) }),
        icon: '🛡️',
        multiplier: '1.0x'
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
    // Retroceder página si la actual queda vacía tras eliminar la tropa
    if (this.currentPage() >= this.totalPages()) {
      this.currentPage.update(p => Math.max(0, p - 1));
    }
  }

  protected onAttackClick(): void {
    if (this.canLaunchAttack()) {
      // Animación visual antes de enviar
      this.showDamagePreview.set(true);
      setTimeout(() => {
        this.launchAttack.emit(this.selectedTroopIds());
        this.selectedTroopIds.set([]);
        this.showAnadirModal.set(false);
        this.showDamagePreview.set(false);
      }, 400);
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
    // Ir a la última página para que el usuario vea las tropas recién añadidas
    this.currentPage.set(this.totalPages() - 1);
  }

  protected isTroopSelected(troopId: string): boolean {
    return this.selectedTroopIds().includes(troopId);
  }

  protected getHealthPercentage(troop: Troop): number {
    return (troop.currentHealth / troop.maxHealth) * 100;
  }

  /**
   * Calcula el multiplicador hexagonal según la ventaja de clan
   * Sistema: FURY ➔ IRON ➔ DIVINE ➔ SHADOW ➔ STORM ➔ FROST ➔ FURY (ciclo)
   * Si el atacante tiene ventaja: 1.5x
   * Si el atacante NO tiene ventaja: 1.0x
   */
  protected getHexagonalMultiplier(): number {
    const attackerClan = this.localClan();
    const defenderClan = this.target().clan;
    
    // Verificar si el atacante tiene ventaja sobre el defensor
    return CLAN_ADVANTAGES[attackerClan] === defenderClan ? 1.5 : 1.0;
  }

  protected onPrevPage(): void {
    if (this.canGoPrev()) this.currentPage.update(p => p - 1);
  }

  protected onNextPage(): void {
    if (this.canGoNext()) this.currentPage.update(p => p + 1);
  }

  protected closeAtacarModal(): void {
    this.closeModal.emit();
  }
}
