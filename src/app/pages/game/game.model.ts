import { ClanId } from './modals/attack.types';

export type GamePhase = 'WAITING' | 'PREPARATION' | 'WAR' | 'END' | 'FINISHED';

export interface PlayerNode {
  characterId: string;
  clan: ClanId;         // Arquetipo (FURY, DIVINE, etc)
  clanId: string;       // ID técnico del clan (berserkers, etc)
  username: string;
  position?: { x: number; y: number }; // Posición en porcentaje
  health?: { current: number; max: number };
  isHost?: boolean;
  troops?: any[];       // Lista de tropas ya entrenadas
  trainingQueue?: any[]; // Cola de entrenamiento activa
  economicCredits?: number;
  researchCredits?: number;
  unlockedResearches?: string[]; // IDs de tecnologías desbloqueadas
  researchInProgress?: { researchId: string; completesAt: number }; // Investigación actual
}

export interface ActiveAttack {
  attacker: PlayerNode;
  defender: PlayerNode;
  troopIds: string[];
  pathId: string; // ID único para el path
  durationMs: number; // Duración total del viaje
  startTime: number; // Timestamp de inicio
  arrivalAt: number; // Timestamp de llegada
  beginSeconds: number; // Offset negativo para sincronizar progreso (-elapsed)
  progress: number;     // Progreso actual (0 a 1) para saltar al punto correcto
}
