import { 
  Component, 
  ChangeDetectionStrategy, 
  input, 
  output, 
  computed, 
  signal, 
  viewChild, 
  ElementRef, 
  AfterViewInit, 
  inject,
  DestroyRef,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { Technology } from './attack.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface TieredTechnology extends Technology {
  tier: number;
}

interface Connection {
  from: string;
  to: string;
  path: string;
}

@Component({
  selector: 'app-arbol-tecnologico-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './arbol-tecnologico.modal.html',
  styleUrl: './arbol-tecnologico.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArbolTecnologicoModalComponent implements AfterViewInit {
  // --- Inyecciones ---
  private readonly destroyRef = inject(DestroyRef);

  // --- Inputs ---
  readonly researchPoints = input.required<number>();
  readonly technologies = input.required<Technology[]>();
  readonly unlockedTechs = input.required<string[]>();

  // --- Outputs ---
  readonly closeModal = output<void>();
  readonly research = output<string>();

  // --- View Children ---
  readonly treeContent = viewChild<ElementRef<HTMLDivElement>>('treeContent');
  readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  // --- State ---
  protected readonly connections = signal<Connection[]>([]);
  
  // Dragging state
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor() {
    // Redibujar conexiones cuando cambian las tecnologías o el estado de desbloqueo
    effect(() => {
      if (this.technologies() || this.unlockedTechs()) {
        // Un pequeño delay para que el DOM se actualice antes de medir
        setTimeout(() => this.drawLines(), 100);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupResizeObserver();
    setTimeout(() => this.drawLines(), 200);
  }

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

    // Regla especial del usuario: la última investigación tiene que ser un tier separado
    // Si hay 8 tecnologías (estándar), la 8va siempre va al tier 4
    if (techs.length === 8) {
      const lastTechId = techs[techs.length - 1].id;
      tierMap.set(lastTechId, 3); // Tier 4 (index 3)
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

    return tiers.filter(t => t !== undefined);
  });

  // --- Métodos de Dibujo ---
  private drawLines(): void {
    const contentEl = this.treeContent()?.nativeElement;
    if (!contentEl) return;

    const contentRect = contentEl.getBoundingClientRect();
    const techs = this.technologies();
    const newConnections: Connection[] = [];

    techs.forEach(tech => {
      if (tech.requirements && tech.requirements.length > 0) {
        tech.requirements.forEach(reqId => {
          const startEl = document.getElementById('tech-' + reqId);
          const endEl = document.getElementById('tech-' + tech.id);

          if (startEl && endEl) {
            const startRect = startEl.getBoundingClientRect();
            const endRect = endEl.getBoundingClientRect();

            const x1 = startRect.right - contentRect.left;
            const y1 = (startRect.top + startRect.bottom) / 2 - contentRect.top;
            const x2 = endRect.left - contentRect.left;
            const y2 = (endRect.top + endRect.bottom) / 2 - contentRect.top;

            // Codo FOE style
            const midX = x1 + (x2 - x1) / 2;
            const path = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;

            newConnections.push({ from: reqId, to: tech.id, path });
          }
        });
      }
    });

    this.connections.set(newConnections);
  }

  private setupResizeObserver(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      this.drawLines();
    });

    observer.observe(container);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  // --- Dragging Logic ---
  protected startDragging(e: MouseEvent): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    this.isDragging = true;
    this.startX = e.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  }

  protected onDragging(e: MouseEvent): void {
    if (!this.isDragging) return;
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;

    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
    // Redibujar no es estrictamente necesario si el SVG está dentro del content que scrollea,
    // pero si hay artifacts visuales se puede forzar.
  }

  protected stopDragging(): void {
    this.isDragging = false;
    const container = this.scrollContainer()?.nativeElement;
    if (container) container.style.cursor = 'grab';
  }

  // --- Métodos de Acción ---
  protected isUnlocked(techId: string): boolean {
    return this.unlockedTechs().includes(techId);
  }

  protected isUnlockable(tech: Technology): boolean {
    if (this.isUnlocked(tech.id)) return false;
    if (this.researchPoints() < tech.researchCost) return false;
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
