import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Technology } from './attack.types';

interface TieredTechnology extends Technology {
  tier: number;
}

@Component({
  selector: 'app-arbol-tecnologico-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './arbol-tecnologico.modal.html',
  styleUrl: './arbol-tecnologico.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArbolTecnologicoModalComponent {
  // --- Inputs ---
  readonly researchPoints = input.required<number>();
  readonly technologies = input.required<Technology[]>();
  readonly unlockedTechs = input.required<string[]>();

  // --- Outputs ---
  readonly closeModal = output<void>();
  readonly research = output<string>();

  // --- Reactive Tiers Calculation ---
  protected readonly tieredTechnologies = computed(() => {
    const techs = this.technologies();
    const tierMap = new Map<string, number>();

    // Calculamos el tier de cada tecnología basado en sus dependencias
    let changed = true;
    while (changed) {
      changed = false;
      for (const tech of techs) {
        if (!tierMap.has(tech.id)) {
          if (!tech.requirements || tech.requirements.length === 0) {
            tierMap.set(tech.id, 0);
            changed = true;
          } else {
            // Revisa si todas las dependencias tienen tier
            const allDepsHaveTier = tech.requirements.every(reqId => tierMap.has(reqId));
            if (allDepsHaveTier) {
              const maxDepTier = Math.max(...tech.requirements.map(reqId => tierMap.get(reqId) ?? 0));
              tierMap.set(tech.id, maxDepTier + 1);
              changed = true;
            }
          }
        }
      }
    }

    // Agrupamos por tier
    const tiers: TieredTechnology[][] = [];
    for (const tech of techs) {
      const tierIndex = tierMap.get(tech.id) ?? 0;
      if (!tiers[tierIndex]) {
        tiers[tierIndex] = [];
      }
      tiers[tierIndex].push({ ...tech, tier: tierIndex });
    }

    // Filtramos empty arrays y retornamos
    return tiers.filter(t => t !== undefined);
  });

  // --- Métodos ---
  protected isUnlocked(techId: string): boolean {
    return this.unlockedTechs().includes(techId);
  }

  protected isUnlockable(tech: Technology): boolean {
    if (this.isUnlocked(tech.id)) return false;
    
    // Tiene suficientes puntos
    if (this.researchPoints() < tech.researchCost) return false;

    // Cumple los requisitos
    if (!tech.requirements || tech.requirements.length === 0) return true;
    
    return tech.requirements.every(reqId => this.isUnlocked(reqId));
  }

  protected onResearchClick(tech: Technology): void {
    if (this.isUnlockable(tech)) {
      this.research.emit(tech.id);
    }
  }

  protected onCloseClick(): void {
    this.closeModal.emit();
  }
}
