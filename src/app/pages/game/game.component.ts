import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { AtacarModalComponent } from './modals/atacar.modal';
import { VisualizarTropasModalComponent } from './modals/visualizar-tropas.modal';
import { EntrenarModalComponent } from './modals/entrenar.modal';
import { GameLogModalComponent } from './modals/game-log.modal';
import { ReglasModalComponent } from './modals/reglas.modal';
import { Troop, EnemyTarget, ClanId, TroopType, TrainableTroopOption, GameLogEntry } from './modals/attack.types';

import { GamePhase, PlayerNode, ActiveAttack } from './game.model';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    AtacarModalComponent,
    VisualizarTropasModalComponent,
    EntrenarModalComponent,
    GameLogModalComponent,
    ReglasModalComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePageComponent {

  // --- Estado de la partida (llegará vía Socket.IO) ---
  protected readonly currentPhase = signal<GamePhase>('GUERRA');
  protected readonly health = signal({ current: 3000, max: 3000 });
  protected readonly gold = signal(150);
  protected readonly researchPts = signal(25);

  // --- Info del jugador local ---
  protected readonly username = signal('Ragnar_Fury');
  protected readonly gameCode = signal('3F8A2C');

  // --- Jugadores en el mapa (mock, vendrá del Socket.IO) ---
  protected readonly players = signal<PlayerNode[]>([
    { clan: 'divine', username: 'Divine', position: { x: 23, y: 26 }, health: { current: 2200, max: 3000 } },
    { clan: 'iron',   username: 'Iron',   position: { x: 66, y: 17 }, health: { current: 2700, max: 3000 } },
    { clan: 'song',   username: 'Song',   position: { x: 22, y: 78 }, health: { current: 1900, max: 3000 } },
    { clan: 'fury',   username: 'Ragnar_Fury',   position: { x: 71, y: 51 }, health: { current: 3000, max: 3000 } },
    { clan: 'rune',   username: 'Rune',   position: { x: 77, y: 81 }, health: { current: 2400, max: 3000 } },
    { clan: 'death',  username: 'Death',  position: { x: 38, y: 56 }, health: { current: 2600, max: 3000 } },
  ]);

  // --- Estado de los modales ---
  protected readonly showAtacarModal = signal(false);
  protected readonly showVisualizarTropasModal = signal(false);
  protected readonly showEntrenarModal = signal(false);
  protected readonly showLogModal = signal(false);
  protected readonly showReglasModal = signal(false);
  protected readonly showDebugPanel = signal(false);
  protected readonly targetEnemy = signal<EnemyTarget | null>(null);
  protected readonly selectedTroopsForAttack = signal<string[]>([]);

  // --- Ataque activo (camino visual) ---
  protected readonly activeAttack = signal<ActiveAttack | null>(null);

  // --- Log de la partida ---
  protected readonly gameLogs = signal<GameLogEntry[]>([]);

  // --- Tropas disponibles (mock, vendrá del servidor) ---
  private readonly troopDeployTimeMs: Record<TroopType, number> = {
    [TroopType.INFANTERIA]: 3200,
    [TroopType.ARQUERIA]: 3600,
    [TroopType.CABALLERIA]: 2800,
  };

  private readonly defaultDeployTimeMs = 3200;

  protected readonly availableTroops = signal<Troop[]>([
    {
      id: 'troop-1',
      name: 'Guerrero 1',
      type: TroopType.INFANTERIA,
      clan: 'fury',
      currentHealth: 100,
      maxHealth: 100,
      icon: '⚔️',
      cost: 50,
      isTraining: false,
      deployed: false,
    },
    {
      id: 'troop-2',
      name: 'Guerrero 2',
      type: TroopType.INFANTERIA,
      clan: 'fury',
      currentHealth: 75,
      maxHealth: 100,
      icon: '⚔️',
      cost: 50,
      isTraining: false,
      deployed: false,
    },
    {
      id: 'troop-3',
      name: 'Arquero 1',
      type: TroopType.ARQUERIA,
      clan: 'fury',
      currentHealth: 60,
      maxHealth: 80,
      icon: '🏹',
      cost: 75,
      isTraining: false,
      deployed: false,
    },
    {
      id: 'troop-4',
      name: 'Arquero 2',
      type: TroopType.ARQUERIA,
      clan: 'fury',
      currentHealth: 80,
      maxHealth: 80,
      icon: '🏹',
      cost: 75,
      isTraining: false,
      deployed: false,
    },
    {
      id: 'troop-5',
      name: 'Caballería 1',
      type: TroopType.CABALLERIA,
      clan: 'fury',
      currentHealth: 120,
      maxHealth: 150,
      icon: '🐴',
      cost: 150,
      isTraining: false,
      deployed: false,
    },
    {
      id: 'troop-6',
      name: 'Caballería 2',
      type: TroopType.CABALLERIA,
      clan: 'fury',
      currentHealth: 50,
      maxHealth: 150,
      icon: '🐴',
      cost: 150,
      isTraining: false,
      deployed: false,
    },
  ]);

  // --- Estado de entrenamiento secuencial ---
  protected readonly trainingQueue = computed(() =>
    this.availableTroops().filter(t => t.isTraining)
  );

  protected readonly activeTrainingTroop = computed(() =>
    this.trainingQueue().length > 0 ? this.trainingQueue()[0] : null
  );

  protected readonly trainingProgress = computed(() => {
    const troop = this.activeTrainingTroop();
    return troop ? (troop.trainingProgress ?? 0) : 0;
  });

  // --- Opciones de entrenamiento (Mock, vendrá del middle server según tech tree) ---
  protected readonly trainableTroopOptions = signal<TrainableTroopOption[]>([
    {
      type: TroopType.INFANTERIA,
      name: 'Infantería',
      cost: 50,
      icon: '⚔️',
      description: 'Guerreros básicos con hachas y escudos.'
    },
    {
      type: TroopType.ARQUERIA,
      name: 'Arquería',
      cost: 75,
      icon: '🏹',
      description: 'Unidades a distancia para hostigar al enemigo.'
    },
    {
      type: TroopType.CABALLERIA,
      name: 'Caballería',
      cost: 150,
      icon: '🐴',
      description: 'Unidades rápidas y poderosas montadas.'
    }
  ]);

  // --- Acciones de los botones laterales ---
  protected openEntrenarTropas(): void {
    this.showEntrenarModal.set(true);
  }

  protected closeEntrenarModal(): void {
    this.showEntrenarModal.set(false);
  }

  protected onTrainTroop(type: TroopType): void {
    const option = this.trainableTroopOptions().find(o => o.type === type);
    if (!option || this.gold() < option.cost) return;

    // Descontar oro (Mock)
    this.gold.update(g => g - option.cost);

    // Añadir tropa a la lista (Mock)
    const newTroop: Troop = {
      id: `troop-${Date.now()}`,
      name: `${option.name} ${this.availableTroops().length + 1}`,
      type: option.type,
      clan: 'fury',
      currentHealth: 100,
      maxHealth: 100,
      icon: option.icon,
      cost: option.cost,
      isTraining: true,
      trainingProgress: 0, // Inicia en 0 (En cola si no es el primero)
      deployed: false
    };

    this.availableTroops.update(ts => [...ts, newTroop]);

    // Registrar en el log
    this.addLogEntry(`ha entrenado ${option.name}`, 'train');
  }

  protected openTropas(): void {
    this.showVisualizarTropasModal.set(true);
  }

  protected closeVisualizarTropasModal(): void {
    this.showVisualizarTropasModal.set(false);
  }

  protected openArbolTecnologico(): void {
    // TODO: abrir modal ArbolTecnologicoModalComponent
  }

  protected openLog(): void {
    this.showLogModal.set(true);
  }

  protected closeLogModal(): void {
    this.showLogModal.set(false);
  }

  /**
   * Añade una entrada al log de la partida
   */
  private addLogEntry(action: string, type: GameLogEntry['type'], performer: string = this.username()): void {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newEntry: GameLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      performer,
      action,
      timestamp,
      type
    };

    this.gameLogs.update(logs => [newEntry, ...logs]); // Nuevo arriba
  }

  // --- Acciones de la barra superior ---
  protected openRules(): void {
    this.showReglasModal.set(true);
  }

  protected closeReglasModal(): void {
    this.showReglasModal.set(false);
  }

  protected openAbandon(): void {
    // TODO: mostrar confirmación de abandono
  }

  // --- Clic en territorio enemigo ---
  protected onTerritoryClick(player: PlayerNode): void {
    // No abrir si es el jugador local
    if (player.username === this.username()) {
      return;
    }
    // No abrir en fase PREPARACIÓN
    if (this.currentPhase() === 'PREPARACIÓN') {
      return;
    }
    // Abrir modal de ataque
    this.targetEnemy.set({
      clan: player.clan,
      username: player.username,
      health: { current: 2500, max: 3000 }, // Mock
    });
    this.selectedTroopsForAttack.set([]);
    this.showAtacarModal.set(true);
  }

  protected closeAtacarModal(): void {
    this.showAtacarModal.set(false);
    this.targetEnemy.set(null);
    this.selectedTroopsForAttack.set([]);
  }

  protected onLaunchAttack(troopIds: string[]): void {
    // TODO: enviar ataque al servidor
    console.log('Attack launched with troops:', troopIds);
    
    // Registrar el ataque activo con camino visual
    const attacker = this.players().find((p) => p.username === this.username())
      ?? this.players().find((p) => p.clan === 'fury');
    const defender = this.players().find((p) => p.username === this.targetEnemy()?.username);

    if (!attacker) {
      console.warn('No se encontró al atacante local en players()', this.username());
    }
    if (!defender) {
      console.warn('No se encontró al defensor target en players()', this.targetEnemy()?.username);
    }

    if (attacker && defender && attacker.position && defender.position) {
      const pathId = this.generatePathId(attacker, defender);
      const durationMs = this.estimateDeploymentDurationMs(troopIds);

      this.activeAttack.set({
        attacker,
        defender,
        troopIds,
        pathId,
        durationMs,
      });
      
      // Limpiar el ataque cuando termine el despliegue visual
      setTimeout(() => {
        this.activeAttack.set(null);
      }, durationMs);
    }
    
    // Registrar en el log
    if (this.targetEnemy()) {
      this.addLogEntry(`ha lanzado un ataque contra ${this.targetEnemy()?.username}`, 'attack');
    }

    this.closeAtacarModal();
  }

  /**
   * Genera un ID único y determinista para el path basado en atacante y defensor
   * Diferente en cada dirección (A->B ≠ B->A)
   */
  private generatePathId(attacker: PlayerNode, defender: PlayerNode): string {
    return `attack-${attacker.username}-to-${defender.username}-${Date.now()}`;
  }

  /**
   * Genera un path SVG directo entre dos puntos
   */
  protected generateAttackPath(): string {
    const attack = this.activeAttack();
    if (!attack || !attack.attacker.position || !attack.defender.position) {
      return '';
    }

    const start = attack.attacker.position;
    const end = attack.defender.position;

    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  private estimateDeploymentDurationMs(troopIds: string[]): number {
    const selectedTroops = this.availableTroops().filter((troop) => troopIds.includes(troop.id));
    const durations = selectedTroops.map((troop) => this.troopDeployTimeMs[troop.type as TroopType] ?? this.defaultDeployTimeMs);
    return durations.length > 0 ? Math.max(...durations) : this.defaultDeployTimeMs;
  }

  // --- MÉTODOS DE DEBUG (Solo para desarrollo) ---
  protected toggleDebugPanel(): void {
    this.showDebugPanel.update(v => !v);
  }

  protected debugAddGold(amount: number): void {
    this.gold.update(g => g + amount);
  }

  protected debugTogglePhase(): void {
    const phases: GamePhase[] = ['PREPARACIÓN', 'GUERRA', 'FIN'];
    const current = this.currentPhase();
    const nextIndex = (phases.indexOf(current) + 1) % phases.length;
    this.currentPhase.set(phases[nextIndex]);
  }

  protected debugAddProgress(step: number): void {
    const troop = this.activeTrainingTroop();
    if (!troop) return;

    const current = troop.trainingProgress ?? 0;
    const next = Math.min(100, Math.max(0, current + step));

    this.availableTroops.update(ts => ts.map(t =>
      t.id === troop.id ? { ...t, trainingProgress: next } : t
    ));
  }

  protected debugCompleteTraining(): void {
    const troop = this.activeTrainingTroop();
    if (troop) {
      this.availableTroops.update(ts => ts.map(t =>
        t.id === troop.id ? { ...t, isTraining: false, trainingProgress: 100 } : t
      ));
    }
  }
}

