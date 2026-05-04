/**
 * Tipos compartidos para los modales de ataque: atacar y añadirTropaAtaque
 */

// Tipos de clan — coincide con clans.yml
export type ClanId = 'FURY' | 'DIVINE' | 'IRON' | 'SHADOW' | 'FROST' | 'STORM';

// Información de una tropa individual
export interface Troop {
  id: string;                 // UUID único de la tropa
  name: string;              // Nombre del tipo de tropa (ej: "Guerrero", "Arquero")
  type: TroopType;           // Tipo de tropa
  clan: ClanId;              // Clan propietario
  currentHealth: number;     // Vitalidad actual
  maxHealth: number;         // Vitalidad máxima
  icon: string;              // URL o identificador del icono SVG
  cost: number;              // Costo en puntos económicos
  isTraining: boolean;       // ¿Está en entrenamiento?
  trainingProgress?: number; // % de progreso del entrenamiento (0-100)
  deployed: boolean;         // ¿Ya está desplegada?
}

// Definición de tipos de tropas (según el árbol tecnológico)
export enum TroopType {
  INFANTERIA = 'infanteria',
  ARQUERIA = 'arqueria',
  CABALLERIA = 'caballeria',
  // Posteriormente más tipos según tech tree
}

// Información de enemigo a atacar
export interface EnemyTarget {
  clan: ClanId;
  username: string;
  health: { current: number; max: number };
}

// Estado de selección de tropas para ataque
export interface AttackSelection {
  target: EnemyTarget;
  selectedTroops: string[]; // Array de IDs de tropas seleccionadas
}

// Datos para la grilla visual (grid de tropas)
export interface TroopGridCell {
  troopId: string;
  position: number; // Posición en la grilla (0-N)
  troop: Troop; // Datos completos de la tropa
}

// Opción para el modal de entrenamiento
export interface TrainableTroopOption {
  type: TroopType;
  name: string;
  cost: number;
  icon: string;
  description?: string;
}

// Estructura de una tecnología en el árbol
export interface Technology {
  id: string;
  name: string;
  description: string;
  researchCost: number;
  durationSeconds: number;
  requirements: string[]; // IDs de tecnologías requeridas
  unlocks?: any; // Efectos de desbloqueo (buffs, tropas)
}

// Registro de log global
export interface GameLogEntry {
  id: string;
  performer: string;  // Nombre del jugador
  action: string;     // Descripción (ej: "ha entrenado Infantería")
  timestamp: string;  // Hora formateada (ej: "18:45")
  type: 'attack' | 'train' | 'research' | 'system';
}

// Ciclo de ventajas de clanes (hexagonal, cada uno vence a 2)
// Reflejamos solo un ciclo simple para compatibilidad con la UI actual si lo requiere,
// aunque la lógica real vive en el servidor.
export const CLAN_ADVANTAGES: Record<string, string> = {
  FURY: 'IRON',
  IRON: 'DIVINE',
  DIVINE: 'SHADOW',
  SHADOW: 'STORM',
  STORM: 'FROST',
  FROST: 'FURY'
};

export const CLAN_NAMES: Record<string, string> = {
  FURY: 'Berserkers',
  DIVINE: 'Valkirias',
  IRON: 'Jarls',
  SHADOW: 'Sombras',
  FROST: 'Frost Guard',
  STORM: 'Storm Bringers'
};
