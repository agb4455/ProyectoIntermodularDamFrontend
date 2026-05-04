import { Component, ChangeDetectionStrategy, signal, computed, inject, isDevMode, OnInit } from '@angular/core';
import { UpperCasePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AtacarModalComponent } from './modals/atacar.modal';
import { VisualizarTropasModalComponent } from './modals/visualizar-tropas.modal';
import { EntrenarModalComponent } from './modals/entrenar.modal';
import { GameLogModalComponent } from './modals/game-log.modal';
import { ReglasModalComponent } from './modals/reglas.modal';
import { LobbyModalComponent } from './modals/lobby.modal';
import { AvisoModalComponent } from './modals/aviso.modal';
import { ConfirmAbandonModalComponent } from './modals/confirm-abandon.modal';
import { ArbolTecnologicoModalComponent } from './modals/arbol-tecnologico.modal';
import { GameService } from '../../core/game/game.service';
import { AuthService } from '../../core/auth/auth.service';
import { CLANS_DATA } from '../../core/game/clans.data';
import { I18nService } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { Troop, EnemyTarget, ClanId, TroopType, TrainableTroopOption, GameLogEntry, Technology } from './modals/attack.types';

import { GamePhase, PlayerNode, ActiveAttack } from './game.model';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    AtacarModalComponent,
    VisualizarTropasModalComponent,
    EntrenarModalComponent,
    GameLogModalComponent,
    ReglasModalComponent,
    LobbyModalComponent,
    AvisoModalComponent,
    ConfirmAbandonModalComponent,
    ArbolTecnologicoModalComponent,
    TranslatePipe,
    UpperCasePipe,
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePageComponent implements OnInit {

  private readonly gameService = inject(GameService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n: I18nService = inject(I18nService);
  protected readonly isDevelopment = signal(isDevMode());

  private readonly continentCoords = [
    { x: 22, y: 28 }, // Niflheim (Top Left)
    { x: 65, y: 20 }, // Jötunheim (Top Right)
    { x: 40, y: 50 }, // Asgard (Center Left)
    { x: 75, y: 50 }, // Midgard (Center Right)
    { x: 22, y: 80 }, // Muspelheim (Bottom Left)
    { x: 72, y: 82 }  // Vanaheim (Bottom Right)
  ];

  // --- Estado de la partida (llegará vía Socket.IO) ---
  protected readonly currentPhase = signal<GamePhase>('WAITING');
  protected readonly health = signal({ current: 3000, max: 3000 });
  protected readonly gold = signal(150);
  protected readonly researchPts = signal(25);

  // --- Info del jugador local ---
  protected readonly username = this.authService.username;
  protected readonly gameCode = signal(this.gameService.gameContext()?.code ?? '3F8A2C');

  // Determina si el usuario actual es el anfitrión (el primero en la lista en este mock)
  protected readonly isHost = computed(() => {
    // Si venimos del lobby con contexto, lo usamos. Si no, usamos el orden de la lista.
    const context = this.gameService.gameContext();
    if (context) return context.isHost;

    const list = this.players();
    return list.length > 0 && list[0].username === this.username();
  });

  protected readonly localClan = computed(() => {
    const context = this.gameService.gameContext();
    return (context?.clan as ClanId) ?? 'fury';
  });

  // --- Jugadores en el mapa (mock, vendrá del Socket.IO) ---
  protected readonly players = signal<PlayerNode[]>(this.getInitialPlayers());

  ngOnInit(): void {
    // Preparar suscripciones (Dejado preparado para integración real)
    this.setupGameSubscriptions();
  }

  /**
   * [PREPARADO] Configura las suscripciones a eventos de Socket.IO
   * Actualmente desconectado ya que el Middle Server está en desarrollo
   */
  private setupGameSubscriptions(): void {
    // TODO: Suscribirse a game:state-update para sincronizar fase, oro y puntos
    // TODO: Suscribirse a game:attack-launched para mostrar ataques de otros jugadores
    // TODO: Suscribirse a game:battle-resolved para actualizar salud de capitales
    console.log('[GAME] Suscripciones preparadas. Esperando Middle Server...');
  }

  private getInitialPlayers(): PlayerNode[] {
    const context = this.gameService.gameContext();
    const localUser: PlayerNode = {
      clan: (context?.clan as ClanId) ?? 'fury',
      username: this.authService.username(),
      health: { current: 3000, max: 3000 }
    };

    const others: PlayerNode[] = [
      { clan: 'divine', username: 'Divine', health: { current: 2200, max: 3000 } },
      { clan: 'iron',   username: 'Iron',   health: { current: 2700, max: 3000 } },
      { clan: 'song',   username: 'Song',   health: { current: 1900, max: 3000 } },
      { clan: 'rune',   username: 'Rune',   health: { current: 2400, max: 3000 } },
      { clan: 'death',  username: 'Death',  health: { current: 2600, max: 3000 } },
    ];

    let list = context?.isHost ? [localUser, ...others] : [...others, localUser];
    
    // Asignar coordenadas fijas por orden
    return list.map((p, i) => ({
      ...p,
      position: this.continentCoords[i] || this.continentCoords[5]
    }));
  }

  // --- Estado de los modales ---
  protected readonly showAtacarModal = signal(false);
  protected readonly showVisualizarTropasModal = signal(false);
  protected readonly showEntrenarModal = signal(false);
  protected readonly showLogModal = signal(false);
  protected readonly showReglasModal = signal(false);
  protected readonly showTechTreeModal = signal(false);
  protected readonly showDebugPanel = signal(false);
  protected readonly showAvisoModal = signal(false);
  protected readonly showAbandonModal = signal(false);
  protected readonly avisoMessage = signal('');
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

  // --- Estado del Árbol Tecnológico ---
  protected readonly clanTechnologies = computed(() => {
    const clanId = this.localClan().toUpperCase(); // FURY, IRON, etc...
    const clanData = CLANS_DATA.find((c: any) => c.archetype === clanId);
    return (clanData?.technologies as Technology[]) || [];
  });

  protected readonly unlockedTechnologies = signal<string[]>([]);

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
    const troopName = this.i18n.translate(`GAME.troop_types.${option.type}`);
    this.addLogEntry(this.i18n.translate('GAME.LOG_TRAIN', { troop: troopName }), 'train');
  }

  protected openTropas(): void {
    this.showVisualizarTropasModal.set(true);
  }

  protected closeVisualizarTropasModal(): void {
    this.showVisualizarTropasModal.set(false);
  }

  protected openArbolTecnologico(): void {
    this.showTechTreeModal.set(true);
  }

  protected closeTechTreeModal(): void {
    this.showTechTreeModal.set(false);
  }

  protected onResearchTechnology(techId: string): void {
    const tech = this.clanTechnologies().find(t => t.id === techId);
    if (!tech || this.researchPts() < tech.researchCost) return;

    // Descontar puntos de investigación
    this.researchPts.update(pts => pts - tech.researchCost);

    // Marcar como desbloqueada
    this.unlockedTechnologies.update(techs => [...techs, techId]);

    // Registrar en el log
    const msg = this.i18n.translate('GAME.LOG_RESEARCH', { tech: tech.name });
    this.addLogEntry(msg, 'research');
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
  protected goBack(): void {
    this.router.navigate(['/lobby']);
  }

  protected openRules(): void {
    this.showReglasModal.set(true);
  }

  protected closeReglasModal(): void {
    this.showReglasModal.set(false);
  }

  protected openAbandon(): void {
    this.showAbandonModal.set(true);
  }

  protected onConfirmAbandon(): void {
    this.showAbandonModal.set(false);
    this.router.navigate(['/lobby']);
  }

  protected onCancelAbandon(): void {
    this.showAbandonModal.set(false);
  }

  // --- Acciones del Lobby ---
  protected onStartGame(): void {
    // En un caso real, esto enviaría un evento al servidor
    // Para el prototipo, simplemente cambiamos de fase
    this.currentPhase.set('PREPARATION');
    this.addLogEntry(this.i18n.translate('GAME.LOG_START'), 'system');
  }

  // --- Clic en territorio enemigo ---
  protected onTerritoryClick(player: PlayerNode): void {
    // No abrir si es el jugador local
    if (player.username === this.username()) {
      return;
    }

    // Si estamos en PREPARACIÓN, no se puede atacar. Mostrar aviso.
    if (this.currentPhase() === 'PREPARATION') {
      this.avisoMessage.set(this.i18n.translate('GAME.MODALS.PREPARATION_AVISO'));
      this.showAvisoModal.set(true);
      return;
    }

    // Abrir modal de ataque (permitido en otras fases)
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

  protected closeAvisoModal(): void {
    this.showAvisoModal.set(false);
    this.avisoMessage.set('');
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
      const msg = this.i18n.translate('GAME.LOG_ATTACK', { target: this.targetEnemy()?.username ?? '' });
      this.addLogEntry(msg, 'attack');
    }

    this.closeAtacarModal();
  }


  /**
   * Genera un path SVG directo entre dos puntos
   */
  protected generateAttackPath(): string {
    const attack = this.activeAttack();
    if (!attack || !attack.attacker.position || !attack.defender.position) {
      return '';
    }

    const p0 = attack.attacker.position;
    const p2 = attack.defender.position;

    // Calcular punto de control desplazado perpendicularmente (inspirado en prueba_ia)
    const midX = (p0.x + p2.x) / 2;
    const midY = (p0.y + p2.y) / 2;

    const dx = p2.x - p0.x;
    const dy = p2.y - p0.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    // El desplazamiento es proporcional a la distancia, limitado a un máximo
    const offset = Math.min(15, len * 0.25);

    // Vector normal (-dy, dx) para desplazar hacia un lado
    const midX_offset = midX + (-dy / len) * offset;
    const midY_offset = midY + (dx / len) * offset;

    return `M ${p0.x} ${p0.y} Q ${midX_offset} ${midY_offset} ${p2.x} ${p2.y}`;
  }

  private generatePathId(attacker: PlayerNode, defender: PlayerNode): string {
    // Sanitizar IDs (quitar espacios)
    const a = attacker.username.replace(/\s+/g, '-');
    const d = defender.username.replace(/\s+/g, '-');
    return `attack-path-${a}-${d}-${Date.now()}`;
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
    const phases: GamePhase[] = ['WAITING', 'PREPARATION', 'WAR', 'END'];
    const current = this.currentPhase();
    const nextIndex = (phases.indexOf(current) + 1) % phases.length;
    this.currentPhase.set(phases[nextIndex]);
  }

  protected debugAddPlayer(): void {
    if (this.players().length >= 6) {
      this.avisoMessage.set('SALA LLENA. No se permiten más de 6 jugadores.');
      this.showAvisoModal.set(true);
      return;
    }

    const clans: ClanId[] = ['divine', 'iron', 'song', 'rune', 'death', 'fury'];
    const clan = clans[Math.floor(Math.random() * clans.length)];
    const id = Math.floor(Math.random() * 1000); // ID más aleatorio para evitar colisiones
    
    this.players.update(ps => {
      const nextIndex = ps.length;
      return [...ps, {
        clan,
        username: `Guerrero_${id}`,
        position: this.continentCoords[nextIndex] || this.continentCoords[5],
        health: { current: 3000, max: 3000 }
      }];
    });
  }

  protected debugRemovePlayer(): void {
    this.players.update(ps => ps.length > 1 ? ps.slice(0, -1) : ps);
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

