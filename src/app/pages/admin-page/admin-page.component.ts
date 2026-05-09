import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService, UserAdminInfo } from '../../core/admin/admin-api.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  
  public readonly globalStats = signal({
    totalUsers: 0,
    totalGames: 0,
    bannedUsers: 0
  });

  public readonly monitoringMetrics = signal({
    activeUsers: 0,
    activeGames: 0,
    finishedGamesLastHour: 0,
    serverLoad: 0
  });

  // Only active bans
  public readonly bans = computed(() => this.allUsers().filter(u => u.isBanned));

  public readonly searchQuery = signal<string>('');
  
  // Real users from API
  private readonly allUsers = signal<UserAdminInfo[]>([]);

  public readonly searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    return this.allUsers().filter(u => 
      !u.isBanned && u.username.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(): void {
    this.adminApi.getStats().subscribe(stats => {
      this.globalStats.set(stats.globalStats);
      this.monitoringMetrics.set(stats.monitoringMetrics);
    });
    this.adminApi.getUsers().subscribe(users => {
      this.allUsers.set(users);
    });
  }

  public updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  public banUser(userId: string): void {
    this.adminApi.banUser(userId).subscribe(() => {
      this.refreshData();
      this.searchQuery.set('');
    });
  }

  public unban(userId: string): void {
    this.adminApi.unbanUser(userId).subscribe(() => {
      this.refreshData();
    });
  }
}
