import { Component, ChangeDetectionStrategy, signal, computed, inject, isDevMode, OnInit, OnDestroy } from '@angular/core';
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
import { AttackResultModalComponent } from './modals/attack-result.modal';
import { GameService } from '../../core/game/game.service';
import { AuthService } from '../../core/auth/auth.service';
import { SocketService } from '../../core/game/socket.service';
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
    AttackResultModalComponent,
    TranslatePipe,
    UpperCasePipe,
    CommonModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GamePageComponent implements OnInit, OnDestroy {

  private readonly gameService = inject(GameService);
  private readonly authService = inject(AuthService);
  private readonly socketService = inject(SocketService);
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

  // --- Estado de la partida (Sincronizado vía Socket.IO) ---
  protected readonly currentPhase = signal<GamePhase>('WAITING');
  protected readonly health = signal({ current: 3000, max: 3000 });
  protected readonly gold = signal(0);
  protected readonly researchPts = signal(0);
  protected readonly now = signal(Date.now());
  private ticker: any;

  // --- Info del jugador local ---
  protected readonly username = this.authService.username;
  protected readonly gameCode = computed(() => this.gameService.gameContext()?.code ?? '000000');
  protected readonly me = computed(() => {
    const myId = this.gameService.myCharacterId();
    if (myId) {
      return this.players().find(p => p.characterId === myId);
    }
    // Fallback por nombre si aún no tenemos el ID
    return this.players().find(p => p.username === this.username());
  });

  protected readonly isHost = computed(() => {
    const myPlayer = this.me();
    if (myPlayer && myPlayer.isHost !== undefined) {
      return myPlayer.isHost;
    }
    // Fallback al contexto del servicio si el jugador aún no está en la lista
    const context = this.gameService.gameContext();
    return context?.isHost ?? false;
  });

  protected readonly localClan = computed(() => {
    const context = this.gameService.gameContext();
    return (context?.clan as ClanId) ?? 'FURY';
  });


  // --- Jugadores en el mapa (Sincronizados desde el servidor) ---
  protected readonly players = signal<PlayerNode[]>(this.getInitialPlayers());
  
  // --- Ataques activos (Array para soportar múltiples ataques simultáneos) ---
  protected readonly activeAttacks = signal<ActiveAttack[]>([]);

  ngOnInit(): void {
    // Preparar suscripciones
    this.setupGameSubscriptions();

    // Iniciar ticker para animaciones de progreso
    this.ticker = setInterval(() => {
      this.now.set(Date.now());
    }, 500);

    // Asegurar que estamos unidos a la partida en el servidor (para refrescos de página)
    const context = this.gameService.gameContext();
    if (context) {
      // console.log('[GAME] Re-uniéndose a la partida:', context.code);
      this.gameService.joinGame(context.code, context.clan, context.isHost);
    }
  }

  ngOnDestroy(): void {
    if (this.ticker) {
      clearInterval(this.ticker);
    }
  }

  /**
   * Configura las suscripciones a eventos de Socket.IO en tiempo real
   * Se conecta a los eventos del Middle Server para sincronizar estado del juego
   */
  private setupGameSubscriptions(): void {
    const socket = this.socketService.getSocket();
    if (!socket) {
      // console.warn('[GAME] Socket no disponible. Reintentando en 1s...');
      setTimeout(() => this.setupGameSubscriptions(), 1000);
      return;
    }

    // Escuchar sincronización de estado general (fase, jugadores, etc)
    socket.on('game:state-sync', (data: any) => {
      // console.log('[Socket] Sincronización de estado recibida:', data);
      
      // Guardar mi characterId si viene en el payload
      if (data.myCharacterId) {
        this.gameService.myCharacterId.set(data.myCharacterId);
        this.authService.setCharacterId(data.myCharacterId);
      }
      
      if (data.phase) this.currentPhase.set(data.phase.toUpperCase());
      
      if (data.players) {
        // data.players es un objeto { characterId: player }, lo convertimos a array
        const playersMap = new Map<string, any>();
        Object.entries(data.players).forEach(([id, p]: [string, any]) => {
          playersMap.set(id, {
            ...p,
            characterId: id,
            clan: p.clan || 'FURY',
            username: p.username || `Vikingo_${id.substring(0, 4)}`,
            health: { 
              current: p.capitalHealth ?? 3000, 
              max: p.maxCapitalHealth ?? 3000 
            }
          });
        });

        const playersList = Array.from(playersMap.values());
        this.players.set(playersList.map((p, i) => ({
          ...p,
          position: this.continentCoords[i] || this.continentCoords[0]
        })));
      }

      // Sincronizar mis recursos locales si estoy en la lista
      const myId = this.gameService.myCharacterId() || '';
      const myData = data.players ? data.players[myId] : null;
      if (myData) {
        if (myData.economicCredits !== undefined) this.gold.set(myData.economicCredits);
        if (myData.researchCredits !== undefined) this.researchPts.set(myData.researchCredits);
        if (myData.capitalHealth !== undefined) {
          this.health.set({ current: myData.capitalHealth, max: myData.maxCapitalHealth || 3000 });
        }
      }

      // Detectar ataques en curso para re-activar animaciones (útil para reconexiones o joins tardíos)
      if (data.players) {
        const now = Date.now();
        const activeAttacksMap = new Map<string, any>();

        Object.entries(data.players).forEach(([fromCharId, p]: [string, any]) => {
          if (p.troops && Array.isArray(p.troops)) {
            p.troops.forEach((t: any) => {
              // Si la tropa está desplegada y aún no ha llegado a su destino
              if (t.deployed && t.travelTargetId && t.arrivalAt > now) {
                const key = `${fromCharId}-${t.travelTargetId}-${t.arrivalAt}`;
                if (!activeAttacksMap.has(key)) {
                  activeAttacksMap.set(key, {
                    fromCharacterId: fromCharId,
                    toCharacterId: t.travelTargetId,
                    arrivalAt: t.arrivalAt,
                    troopCount: 0,
                    fromPlayer: p.username || 'Desconocido'
                  });
                }
                activeAttacksMap.get(key).troopCount++;
              }
            });
          }
        });

        // Disparar las animaciones detectadas
        activeAttacksMap.forEach(attackData => this.triggerAttackAnimation(attackData));
      }
      
      // console.log('[GAME] Estado sincronizado:', data);
    });

    // Escuchar actualización de recursos (oro y créditos de investigación)
    socket.on('player:resources-updated', (data: any) => {
      if (data.economicCredits !== undefined) this.gold.set(data.economicCredits);
      if (data.researchCredits !== undefined) this.researchPts.set(data.researchCredits);
      // console.log('[GAME] Recursos actualizados:', data);
    });

    // Escuchar nuevos logs compartidos
    socket.on('game:new-log', (logEntry: GameLogEntry) => {
      // Evitar duplicados si nosotros fuimos quienes emitimos este log
      if (!this.gameLogs().some(l => l.id === logEntry.id)) {
        this.gameLogs.update(logs => [logEntry, ...logs]);
      }
    });

    // Escuchar confirmación de entrenamiento iniciado
    socket.on('player:train-queued', (data: any) => {
      if (data.trainingQueue) {
        this.broadcastLogEntry(this.i18n.translate('GAME.LOG_TRAIN_CONFIRM'), 'train');
      }
      if (data.economicCredits !== undefined) this.gold.set(data.economicCredits);
      // console.log('[GAME] Entrenamiento en cola:', data);
    });

    // Escuchar entrenamiento finalizado
    socket.on('player:troop-trained', (data: any) => {
      if (data.characterId === this.gameService.myCharacterId()) {
        const troopName = this.getTroopName(data.troop.typeId);
        this.broadcastLogEntry(this.i18n.translate('GAME.LOG_TRAIN_COMPLETE', { troop: troopName }), 'train');
      }
      // console.log('[GAME] Tropa entrenada:', data);
    });

    // Escuchar confirmación de investigación iniciada
    socket.on('player:research-started', (data: any) => {
      if (data.researchId) {
        this.unlockedTechnologies.update(techs => [...techs, data.researchId]);
        this.broadcastLogEntry(this.i18n.translate('GAME.LOG_RESEARCH_CONFIRM'), 'research');
      }
      if (data.researchCredits !== undefined) this.researchPts.set(data.researchCredits);
      // console.log('[GAME] Investigación iniciada:', data);
    });

    // Escuchar investigación finalizada
    socket.on('player:research-complete', (data: any) => {
      if (data.characterId === this.gameService.myCharacterId()) {
        // Encontrar el nombre de la tecnología
        const tech = this.clanTechnologies().find(t => t.id === data.researchId);
        const techName = tech?.name || data.researchId;
        this.broadcastLogEntry(this.i18n.translate('GAME.LOG_RESEARCH_COMPLETE', { tech: techName }), 'research');
      }
      // console.log('[GAME] Investigación completada:', data);
    });

    // Escuchar ataques lanzados por otros jugadores (movimiento de tropas)
    socket.on('game:troop-deployed', (data: any) => {
      // 1. Si somos el defensor, mostrar el log local de advertencia
      if (data.toCharacterId === this.authService.characterId()) {
        this.addLocalLogEntry(
          this.i18n.translate('GAME.LOG_ATTACK_RECEIVED', { attacker: data.fromPlayer }),
          'attack',
          data.fromPlayer
        );
      }

      // 2. Disparar animación visual del ataque para todos
      this.triggerAttackAnimation(data);
    });

    // Confirmación de que nuestro ataque fue lanzado (ahora solo como log de depuración o info extra)
    socket.on('game:attack-launched', (data: any) => {
      // console.log('[GAME] Confirmación de ataque propio:', data);
    });

    // Escuchar resultados de batalla
    socket.on('game:battle-result', (data: any) => {
      // Si somos el defensor
      if (data.targetCharacterId === this.authService.characterId()) {
        if (data.characterHealth) this.health.set(data.characterHealth);
        if (data.battleLog) {
          this.addLocalLogEntry(
            this.i18n.translate('GAME.LOG_BATTLE_RESULT', { attacker: data.attackerUsername }),
            'attack'
          );
        }
      }
      
      // Si somos el atacante
      if (data.attackerCharacterId === this.authService.characterId()) {
        this.recentAttackResult.set(data);
        
        // Auto-dismiss del toast después de 15 segundos si no se interactúa con él
        setTimeout(() => {
          if (this.recentAttackResult() === data && !this.showAttackResultModal()) {
            this.dismissAttackToast();
          }
        }, 15000);
      }
      
      // console.log('[GAME] Resultado de batalla:', data);
    });

    // Escuchar cambios de fase
    socket.on('game:phase-changed', (data: any) => {
      if (data.newPhase) {
        this.currentPhase.set(data.newPhase);
        this.addLocalLogEntry(
          this.i18n.translate('GAME.LOG_PHASE_CHANGE', { phase: data.newPhase }),
          'system'
        );
      }
    });

    // Escuchar eliminación de jugador
    socket.on('game:player-eliminated', (data: any) => {
      if (data.characterId) {
        this.players.update(ps => ps.filter(p => p.characterId !== data.characterId));
        this.addLocalLogEntry(
          this.i18n.translate('GAME.LOG_PLAYER_ELIMINATED', { player: data.username }),
          'system'
        );
      }
    });

    // Escuchar el fin de la partida
    socket.on('game:ended', (data: any) => {
      this.currentPhase.set('FINISHED');
      const isWinner = data.winnerCharacterId === this.authService.characterId();
      
      this.addLocalLogEntry(
        isWinner 
          ? this.i18n.translate('GAME.LOG_GAME_WON') 
          : this.i18n.translate('GAME.LOG_GAME_LOST'),
        'system'
      );
      
      // Mostrar alerta o modal de fin de partida (simplificado para MVP)
      setTimeout(() => {
        const msg = isWinner 
          ? this.i18n.translate('GAME.LOG_GAME_WON') 
          : this.i18n.translate('GAME.LOG_GAME_LOST');
        alert(msg);
        this.gameService.clearGameContext();
        this.router.navigate(['/lobby']);
      }, 3000);
    });

    // Escuchar errores del servidor
    socket.on('game:error', (data: any) => {
      if (data.message) {
        this.avisoMessage.set(data.message);
        this.showAvisoModal.set(true);
      }
    });

    // console.log('[GAME] Suscripciones a eventos Socket.IO configuradas correctamente');
  }

  private getInitialPlayers(): PlayerNode[] {
    const context = this.gameService.gameContext();
    const localUser: PlayerNode = {
      characterId: this.authService.characterId() || 'me',
      clan: (context?.clan as ClanId) ?? 'FURY',
      clanId: this.getClanIdByArchetype((context?.clan as ClanId) ?? 'FURY'),
      username: this.authService.username(),
      health: { current: 3000, max: 3000 }
    };

    const others: PlayerNode[] = [];
    let list = context?.isHost ? [localUser, ...others] : [...others, localUser];
    
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
  protected readonly showAttackResultModal = signal(false);
  
  protected readonly avisoMessage = signal('');
  protected readonly targetEnemy = signal<EnemyTarget | null>(null);
  protected readonly selectedTroopsForAttack = signal<string[]>([]);
  protected readonly recentAttackResult = signal<any>(null);


  // --- Log de la partida ---
  protected readonly gameLogs = signal<GameLogEntry[]>([]);

  protected readonly availableTroops = computed(() => {
    const myPlayer = this.me();
    if (!myPlayer) return [];

    const clanId = myPlayer.clanId || this.getClanIdByArchetype(myPlayer.clan);
    const allTroops: Troop[] = [];

    // 1. Tropas reales (ya entrenadas)
    if (myPlayer.troops) {
      myPlayer.troops.forEach((t: any) => {
        allTroops.push({
          id: t.id,
          typeId: t.typeId,
          name: this.getTroopName(t.typeId),
          type: this.getTroopType(t.typeId),
          clan: clanId as ClanId,
          currentHealth: t.currentPoints,
          maxHealth: t.maxPoints,
          icon: this.getTroopIcon(t.typeId),
          cost: 0,
          isTraining: false,
          deployed: t.deployed
        });
      });
    }

    // 2. Cola de entrenamiento
    if (myPlayer.trainingQueue) {
      myPlayer.trainingQueue.forEach((q: any) => {
        const duration = this.getTroopDuration(q.troopTypeId) * 1000;
        const startTime = q.completesAt - duration;
        const elapsed = this.now() - startTime;
        const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));

        allTroops.push({
          id: q.trainingId,
          typeId: q.troopTypeId,
          name: this.getTroopName(q.troopTypeId),
          type: this.getTroopType(q.troopTypeId),
          clan: clanId as ClanId,
          currentHealth: 0,
          maxHealth: 100,
          icon: this.getTroopIcon(q.troopTypeId),
          cost: 0,
          isTraining: true,
          trainingProgress: progress,
          deployed: false,
          completesAt: q.completesAt
        });
      });
    }

    return allTroops;
  });

  private getClanIdByArchetype(archetype: ClanId): string {
    const data = CLANS_DATA.find(c => c.archetype === archetype);
    return data?.id || 'berserkers';
  }

  // --- Helpers de datos de tropas ---
  private getTroopData(typeId: string): any {
    for (const clan of CLANS_DATA) {
      const troop = clan.initialTroops?.find((t: any) => t.id === typeId);
      if (troop) return troop;
      
      for (const tech of clan.technologies || []) {
        const techTroop = tech.unlocks?.troops?.find((t: any) => t.id === typeId);
        if (techTroop) return techTroop;
      }
    }
    return null;
  }

  private getTroopName(typeId: string): string {
    return this.getTroopData(typeId)?.name || typeId;
  }

  private getTroopType(typeId: string): TroopType {
    const type = this.getTroopData(typeId)?.type;
    return (type as TroopType) || TroopType.ATK;
  }

  private getTroopIcon(typeId: string): string {
    const type = this.getTroopType(typeId);
    switch (type) {
      case TroopType.ATK: return '⚔️';
      case TroopType.DEF: return '🛡️';
      case TroopType.HEAL: return '✨';
      case TroopType.SUPP: return '🏹';
      default: return '👤';
    }
  }

  private getTroopDuration(typeId: string): number {
    return this.getTroopData(typeId)?.trainingTimeSeconds || 30;
  }

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

  // --- Opciones de entrenamiento (Actualizadas según tech tree) ---
  protected readonly trainableTroopOptions = computed<TrainableTroopOption[]>(() => {
    const myPlayer = this.me();
    if (!myPlayer) return [];

    const clanId = myPlayer.clanId || this.getClanIdByArchetype(myPlayer.clan);
    const clanData = CLANS_DATA.find((c: any) => 
      c.archetype === myPlayer.clan || c.id === clanId
    );
    if (!clanData) return [];

    // Opciones iniciales
    const options: TrainableTroopOption[] = (clanData.initialTroops || []).map((t: any) => ({
      id: t.id,
      type: t.type as TroopType,
      name: t.name,
      cost: t.cost,
      icon: this.getTroopIcon(t.id),
      description: `Unidad básica de ${clanData.name}.`
    }));

    // Añadir tropas desbloqueadas por tecnologías
    const unlockedIds = myPlayer.unlockedResearches || [];
    clanData.technologies?.forEach((tech: any) => {
      if (unlockedIds.includes(tech.id) && tech.unlocks?.troops) {
        tech.unlocks.troops.forEach((t: any) => {
          // Evitar duplicados
          if (!options.find(o => o.id === t.id)) {
            options.push({
              id: t.id,
              type: t.type as TroopType,
              name: t.name,
              cost: t.cost,
              icon: this.getTroopIcon(t.id),
              description: tech.name
            });
          }
        });
      }
    });

    return options;
  });

  // --- Estado del Árbol Tecnológico ---
  protected readonly clanTechnologies = computed(() => {
    const clanId = this.localClan().toUpperCase(); // FURY, IRON, etc...
    const clanData = CLANS_DATA.find((c: any) => 
      c.archetype === clanId || c.id.toUpperCase() === clanId
    );
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

  protected onTrainTroop(id: string): void {
    const option = this.trainableTroopOptions().find(o => o.id === id);
    if (!option || this.gold() < option.cost) return;

    const gameContext = this.gameService.gameContext();
    if (!gameContext) {
      // console.error('[GAME] No hay contexto de partida disponible');
      return;
    }

    // Emitir evento al servidor para entrenar tropa
    this.socketService.emit('game:train', {
      gameId: gameContext.code,
      troopTypeId: id
    });

    // Registrar en el log (feedback local inmediato)
    const troopName = option.name;
    this.broadcastLogEntry(this.i18n.translate('GAME.LOG_TRAIN', { troop: troopName }), 'train');
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

    const gameContext = this.gameService.gameContext();
    if (!gameContext) {
      // console.error('[GAME] No hay contexto de partida disponible');
      return;
    }

    // Emitir evento al servidor para investigar tecnología
    this.socketService.emit('game:research', {
      gameId: gameContext.code,
      researchId: techId
    });

    // Registrar en el log (feedback local inmediato)
    const msg = this.i18n.translate('GAME.LOG_RESEARCH', { tech: tech.name });
    this.broadcastLogEntry(msg, 'research');
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
  private addLocalLogEntry(action: string, type: GameLogEntry['type'], performer: string = this.username()): void {
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

  /**
   * Añade una entrada al log local y la retransmite a la sala entera
   */
  private broadcastLogEntry(action: string, type: GameLogEntry['type'], performer: string = this.username()): void {
    const gameContext = this.gameService.gameContext();
    if (!gameContext) return;
    
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newEntry: GameLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      performer,
      action,
      timestamp,
      type
    };

    this.gameLogs.update(logs => [newEntry, ...logs]);

    this.socketService.emit('game:send-log', {
      gameId: gameContext.code,
      logEntry: newEntry
    });
  }

  // --- Acciones de la barra superior ---
  protected goBack(): void {
    this.gameService.clearGameContext();
    this.router.navigate(['/lobby']);
  }

  protected openRules(): void {
    this.showReglasModal.set(true);
  }

  protected closeReglasModal(): void {
    this.showReglasModal.set(false);
  }

  protected openAttackResultModal(): void {
    this.showAttackResultModal.set(true);
  }

  protected closeAttackResultModal(): void {
    this.showAttackResultModal.set(false);
    this.recentAttackResult.set(null);
  }

  protected dismissAttackToast(): void {
    this.recentAttackResult.set(null);
  }

  protected openAbandon(): void {
    this.showAbandonModal.set(true);
  }

  protected onConfirmAbandon(): void {
    this.showAbandonModal.set(false);

    const gameContext = this.gameService.gameContext();
    if (gameContext) {
      // Emitimos el evento de abandono
      this.socketService.emit('game:abandon', { gameId: gameContext.code });
      
      // Damos un pequeño margen para que el socket envíe el mensaje antes de desconectar
      setTimeout(() => {
        this.gameService.clearGameContext();
        this.router.navigate(['/lobby']);
      }, 100);
    } else {
      this.router.navigate(['/lobby']);
    }
  }

  protected onCancelAbandon(): void {
    this.showAbandonModal.set(false);
  }

  // --- Acciones del Lobby ---
  protected onStartGame(): void {
    const gameContext = this.gameService.gameContext();
    if (!gameContext) {
      // console.error('[GAME] No hay contexto de partida disponible');
      return;
    }

    if (!this.isHost()) {
      this.avisoMessage.set(this.i18n.translate('GAME.MODALS.ONLY_HOST_CAN_START'));
      this.showAvisoModal.set(true);
      return;
    }

    // Emitir evento al servidor para iniciar la partida
    this.socketService.emit('game:start', { gameId: gameContext.code });
    this.broadcastLogEntry(this.i18n.translate('GAME.LOG_START'), 'system');
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
      characterId: player.characterId,
      clan: player.clan,
      username: player.username,
      health: player.health ?? { current: 3000, max: 3000 },
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
    const gameContext = this.gameService.gameContext();
    const targetEnemy = this.targetEnemy();
    
    if (!gameContext) {
      // console.error('[GAME] No hay contexto de partida disponible');
      return;
    }

    if (!targetEnemy) {
      // console.warn('[GAME] No hay enemigo objetivo seleccionado');
      return;
    }

    // Emitir evento al servidor para lanzar ataque
    this.socketService.emit('game:attack', {
      gameId: gameContext.code,
      targetCharacterId: targetEnemy.characterId,
      troopIds: troopIds
    });

    // Feedback local inmediato (predicción)
    const attacker = this.players().find((p) => p.username === this.username())
      ?? this.players().find((p) => p.clan === 'FURY');
    const defender = this.players().find((p) => p.username === targetEnemy?.username);

    if (attacker && defender) {
      const durationMs = this.estimateDeploymentDurationMs(troopIds);
      this.triggerAttackAnimation({
        fromCharacterId: attacker.characterId,
        toCharacterId: defender.characterId,
        arrivalAt: Date.now() + durationMs,
        totalTravelTimeMs: durationMs,
        troopCount: troopIds.length
      });
    }
    
    // Registrar en el log
    if (targetEnemy) {
      const msg = this.i18n.translate('GAME.LOG_ATTACK', { target: targetEnemy.username ?? '' });
      this.broadcastLogEntry(msg, 'attack');
    }

    this.closeAtacarModal();
  }


  /**
   * Genera el path SVG para un ataque específico de la lista
   */
  protected generatePathForAttack(attack: ActiveAttack): string {
    const attacker = this.players().find(p => p.characterId === attack.attacker.characterId);
    const defender = this.players().find(p => p.characterId === attack.defender.characterId);

    if (!attacker?.position || !defender?.position) return '';

    const p0 = attacker.position;
    const p2 = defender.position;

    const midX = (p0.x + p2.x) / 2;
    const midY = (p0.y + p2.y) / 2;
    const dx = p2.x - p0.x;
    const dy = p2.y - p0.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const offset = Math.min(15, len * 0.25);
    const midX_offset = midX + (-dy / len) * offset;
    const midY_offset = midY + (dx / len) * offset;

    return `M ${p0.x} ${p0.y} Q ${midX_offset} ${midY_offset} ${p2.x} ${p2.y}`;
  }

  /**
   * Dispara o actualiza una animación de ataque sincronizada
   */
  private triggerAttackAnimation(data: any): void {
    const attacker = this.players().find((p) => p.characterId === data.fromCharacterId);
    const defender = this.players().find((p) => p.characterId === data.toCharacterId);

    if (!attacker || !defender || !attacker.position || !defender.position) return;

    const now = Date.now();
    const arrivalAt = data.arrivalAt;
    const totalDurationMs = data.totalTravelTimeMs || 10000;
    const startTime = arrivalAt - totalDurationMs;
    const elapsedMs = now - startTime;
    const remainingMs = arrivalAt - now;

    // Si el ataque ya debería haber llegado, no lo mostramos
    if (remainingMs <= 0) return;

    const pathId = this.generatePathId(attacker, defender);
    
    // Evitar duplicados
    if (this.activeAttacks().some(a => a.pathId === pathId)) return;

    // Calcular progreso para el "salto" inicial si el ataque ya empezó
    const progress = Math.max(0, Math.min(0.99, elapsedMs / totalDurationMs));
    const remainingDurMs = arrivalAt - now;

    const newAttack: ActiveAttack = {
      attacker,
      defender,
      troopIds: Array(data.troopCount || 0).fill('unknown'),
      pathId,
      durationMs: remainingDurMs,
      startTime,
      arrivalAt,
      beginSeconds: 0, // Ya no usamos begin negativo
      progress: progress // Guardamos el progreso inicial
    };

    this.activeAttacks.update(current => [...current, newAttack]);

    // Limpiar automáticamente al llegar
    setTimeout(() => {
      this.activeAttacks.update(current => current.filter(a => a.pathId !== pathId));
    }, remainingDurMs);
  }

  private generatePathId(attacker: PlayerNode, defender: PlayerNode): string {
    // Sanitizar nombres: solo caracteres alfanuméricos para evitar IDs inválidos en SVG
    const a = attacker.username.replace(/[^a-zA-Z0-9]/g, '');
    const d = defender.username.replace(/[^a-zA-Z0-9]/g, '');
    // El ID debe ser estable durante el viaje para que la animación no se reinicie
    return `attack-path-${a}-${d}`;
  }

  private estimateDeploymentDurationMs(troopIds: string[]): number {
    // Sincronizado con config.troopTravelTimeMs del Middle Server (10 segundos)
    return 10000;
  }

  // --- MÉTODOS DE DEBUG (Solo para desarrollo) ---
  protected toggleDebugPanel(): void {
    this.showDebugPanel.update(v => !v);
  }

  protected debugAddGold(amount: number): void {
    this.gold.update(g => g + amount);
  }

  protected debugTogglePhase(): void {
    const phases: GamePhase[] = ['WAITING', 'PREPARATION', 'WAR', 'END', 'FINISHED'];
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

    const clans: ClanId[] = ['FURY', 'DIVINE', 'IRON', 'SHADOW', 'FROST', 'STORM'];
    const clan = clans[Math.floor(Math.random() * clans.length)];
    const id = Math.floor(Math.random() * 1000); // ID más aleatorio para evitar colisiones
    
    this.players.update(ps => {
      const nextIndex = ps.length;
      return [...ps, {
        characterId: `debug-${id}`,
        clan,
        clanId: this.getClanIdByArchetype(clan),
        username: `Vikingo_${id}`,
        position: this.continentCoords[nextIndex] || this.continentCoords[5],
        health: { current: 3000, max: 3000 },
        troops: [],
        trainingQueue: [],
        unlockedResearches: [],
        economicCredits: 0,
        researchCredits: 0
      }];
    });
  }

  protected debugRemovePlayer(): void {
    this.players.update(ps => ps.length > 1 ? ps.slice(0, -1) : ps);
  }
}

