import { ClanId } from './modals/attack.types';

export type GamePhase = 'WAITING' | 'PREPARATION' | 'WAR' | 'END';

export interface PlayerNode {
  characterId: string;
  clan: ClanId;
  username: string;
  position?: { x: number; y: number }; // Posición en porcentaje
  health?: { current: number; max: number };
  isHost?: boolean;
}

export interface ActiveAttack {
  attacker: PlayerNode;
  defender: PlayerNode;
  troopIds: string[];
  pathId: string; // ID único para el path
  durationMs: number; // Duración del despliegue / animación del camino
}
