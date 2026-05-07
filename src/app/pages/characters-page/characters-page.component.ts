import { Component, ChangeDetectionStrategy, signal, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClanDetail } from './characters.model';
import { CLANS_DATA } from '../../core/game/clans.data';
import { AppConfigService } from '../../core/config/app-config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  // Estado
  protected readonly clans = signal<ClanDetail[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly error = signal<string | null>(null);

  constructor() {
    // Al inicializar, cargar datos estáticos primero para UI rápida
    this.clans.set(this.mapClans());
  }

  ngOnInit(): void {
    // Intentar cargar datos dinámicos desde el servidor
    this.loadClansStats();
  }

  /**
   * Carga estadísticas dinámicas de clanes desde el Middle Server
   * Si falla, usa los datos estáticos locales
   */
  private loadClansStats(): void {
    const endpoint = `${this.config.config.middleServerUrl}/api/clans/stats`;
    
    this.http.get<any[]>(endpoint).subscribe({
      next: (serverClans) => {
        // Combinar datos estáticos con datos del servidor
        const enhancedClans = this.mapClans().map(localClan => {
          const serverData = serverClans.find(sc => sc.archetype === localClan.archetype);
          return {
            ...localClan,
            // Datos dinámicos del servidor (si están disponibles)
            winRate: serverData?.winRate ?? 0,
            totalGames: serverData?.totalGames ?? 0,
            totalPlayers: serverData?.totalPlayers ?? 0,
            avgHealth: serverData?.avgHealth ?? 3000,
            avgLevel: serverData?.avgLevel ?? 1
          };
        });
        
        this.clans.set(enhancedClans);
        this.isLoading.set(false);
        console.log('[CHARACTERS] Estadísticas de clanes cargadas desde servidor');
      },
      error: (err) => {
        // Si falla la carga del servidor, usar datos locales
        console.warn('[CHARACTERS] Error al cargar estadísticas:', err.message);
        this.error.set('No se pudieron cargar las estadísticas del servidor. Usando datos locales.');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Mapea datos de CLANS_DATA a formato ClanDetail
   */
  private mapClans(): ClanDetail[] {
    const ARCHETYPE_ICONS: Record<string, string> = {
      FURY: '🪓',
      DIVINE: '⚡',
      IRON: '🛡️',
      SHADOW: '👤',
      FROST: '❄️',
      STORM: '🌩️'
    };

    return CLANS_DATA.map(clan => {
      const beatenBy = CLANS_DATA
        .filter(c => c.advantages.includes(clan.archetype))
        .map(c => c.name)
        .join(', ');

      return {
        id: clan.id,
        name: clan.name,
        archetype: clan.archetype,
        description: clan.description,
        beats: clan.advantages.join(', '),
        beatsReason: 'Ventaja táctica según el Círculo del Destino.',
        beatenBy: beatenBy,
        colorVar: `--color-clan-${clan.archetype.toLowerCase()}`,
        icon: ARCHETYPE_ICONS[clan.archetype] || '⚔️',
        winRate: 0,
        totalGames: 0,
        totalPlayers: 0,
        avgHealth: 3000,
        avgLevel: 1
      };
    });
  }
}
