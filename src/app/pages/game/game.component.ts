import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { AtacarModalComponent } from './modals/atacar.modal';
import { Troop, EnemyTarget, ClanId, TroopType } from './modals/attack.types';

// Tipos del clan para tipado estricto
type GamePhase = 'PREPARACIÓN' | 'GUERRA' | 'FIN';

interface PlayerNode {
  clan: ClanId;
  username: string;
  position?: { x: number; y: number }; // Posición en porcentaje
  health?: { current: number; max: number };
}

interface ActiveAttack {
  attacker: PlayerNode;
  defender: PlayerNode;
  troopIds: string[];
  pathId: string; // ID único para el path
  durationMs: number; // Duración del despliegue / animación del camino
}

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [AtacarModalComponent],
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

  // --- Estado del modal de ataque ---
  protected readonly showAtacarModal = signal(false);
  protected readonly targetEnemy = signal<EnemyTarget | null>(null);
  protected readonly selectedTroopsForAttack = signal<string[]>([]);

  // --- Ataque activo (camino visual) ---
  protected readonly activeAttack = signal<ActiveAttack | null>(null);

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
      type: 'infanteria' as any,
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
      type: 'infanteria' as any,
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
      type: 'arqueria' as any,
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
      type: 'arqueria' as any,
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
      type: 'caballeria' as any,
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
      type: 'caballeria' as any,
      clan: 'fury',
      currentHealth: 50,
      maxHealth: 150,
      icon: '🐴',
      cost: 150,
      isTraining: false,
      deployed: false,
    },
  ]);

  // --- Acciones de los botones laterales (modales pendientes) ---
  protected openEntrenarTropas(): void {
    // TODO: abrir modal EntrenarTropasModalComponent
  }

  protected openTropas(): void {
    // TODO: abrir modal TropasModalComponent
  }

  protected openArbolTecnologico(): void {
    // TODO: abrir modal ArbolTecnologicoModalComponent
  }

  protected openLog(): void {
    // TODO: abrir modal LogModalComponent
  }

  // --- Acciones de la barra superior ---
  protected openRules(): void {
    // TODO: abrir modal de Reglas del juego
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
}
