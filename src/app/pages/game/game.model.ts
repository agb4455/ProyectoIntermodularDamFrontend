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
}

export interface ActiveAttack {
  attacker: PlayerNode;
  defender: PlayerNode;
  troopIds: string[];
  pathId: string; // ID único para el path
  durationMs: number; // Duración del despliegue / animación del camino
}
