import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanRecord } from './admin-page.model';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPageComponent {
  
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
  public readonly bans = signal<BanRecord[]>([]);

  public readonly searchQuery = signal<string>('');
  
  // Dummy users for the search simulation
  private readonly allUsers: any[] = [];

  public readonly searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return [];
    return this.allUsers.filter(u => u.username.toLowerCase().includes(query));
  });

  public updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  public banUser(username: string): void {
    console.log(`Ban request for user: ${username}`);
    // Simulate action
    this.searchQuery.set('');
  }

  public unban(id: string): void {
    console.log(`Unban request for id: ${id}`);
    this.bans.update(current => current.filter(b => b.id !== id));
  }
}
