import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

/** 
 * Estructura de datos de un clan proveniente del Middle Server (clans.yml)
 */
export interface ClanData {
  id: string;
  name: string;
  archetype: string;
  description: string;
  color: string;
  baseCapitalHealth: number;
  advantages: string[];
  initialTroops: any[];
  technologies: any[];
}

@Injectable({ providedIn: 'root' })
export class GameApiService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(AppConfigService);

  /**
   * Obtiene la configuración completa de clanes desde el Middle Server.
   * @returns Observable con el array de clanes.
   */
  getClans(): Observable<ClanData[]> {
    const url = `${this.configService.config.middleServerUrl}/api/clans`;
    return this.http.get<ClanData[]>(url);
  }
}
