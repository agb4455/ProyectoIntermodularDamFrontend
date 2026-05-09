import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

export interface AdminStats {
  globalStats: {
    totalUsers: number;
    totalGames: number;
    bannedUsers: number;
  };
  monitoringMetrics: {
    activeUsers: number;
    activeGames: number;
    finishedGamesLastHour: number;
    serverLoad: number;
  };
}

export interface UserAdminInfo {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  isBanned: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(AppConfigService);

  getStats(): Observable<AdminStats> {
    const url = `${this.configService.config.middleServerUrl}/api/admin/stats`;
    return this.http.get<AdminStats>(url);
  }

  getUsers(): Observable<UserAdminInfo[]> {
    const url = `${this.configService.config.middleServerUrl}/api/admin/users`;
    return this.http.get<UserAdminInfo[]>(url);
  }

  banUser(userId: string): Observable<void> {
    const url = `${this.configService.config.middleServerUrl}/api/admin/users/${userId}/ban`;
    return this.http.put<void>(url, {});
  }

  unbanUser(userId: string): Observable<void> {
    const url = `${this.configService.config.middleServerUrl}/api/admin/users/${userId}/unban`;
    return this.http.put<void>(url, {});
  }
}
