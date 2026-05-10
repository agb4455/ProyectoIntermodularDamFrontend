import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

export interface UserStats {
  totalWins: number;
  totalAttacks: number;
  totalTroopsLost: number;
  totalTrained: number;
  totalCreditsEarned: number;
  totalPlayTimeMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class StatisticsApiService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(AppConfigService);

  getUserStats(gameId?: string): Observable<UserStats> {
    let url = `${this.configService.config.middleServerUrl}/api/profile/stats`;
    if (gameId) {
      url += `?gameId=${gameId}`;
    }
    return this.http.get<UserStats>(url);
  }
}
