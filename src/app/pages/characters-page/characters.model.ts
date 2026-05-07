export interface ClanDetail {
  id: string;
  name: string;
  archetype: string;
  description: string;
  beats: string;
  beatsReason: string;
  beatenBy: string;
  colorVar: string;
  icon: string;
  // Estadísticas dinámicas (del servidor)
  winRate?: number;
  totalGames?: number;
  totalPlayers?: number;
  avgHealth?: number;
  avgLevel?: number;
}
