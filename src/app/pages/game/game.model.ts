import { ClanId } from './modals/attack.types';

export type GamePhase = 'WAITING' | 'PREPARACIÓN' | 'GUERRA' | 'FIN';

export interface PlayerNode {
  clan: ClanId;
  username: string;
  position?: { x: number; y: number }; // Posición en porcentaje
  health?: { current: number; max: number };
}

export interface ActiveAttack {
  attacker: PlayerNode;
  defender: PlayerNode;
  troopIds: string[];
  pathId: string; // ID único para el path
  durationMs: number; // Duración del despliegue / animación del camino
}
