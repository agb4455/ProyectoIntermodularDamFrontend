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
    totalUsers: 1248,
    totalGames: 3592,
    bannedUsers: 42
  });

  public readonly monitoringMetrics = signal({
    activeUsers: 34,
    activeGames: 12,
    finishedGamesLastHour: 8,
    serverLoad: 78
  });

  // Only active bans
  public readonly bans = signal<BanRecord[]>([
    { id: '1', user: 'RagnarTheRed', reason: 'Insultos reiterados en el chat', expiresIn: '48 horas' },
    { id: '3', user: 'HackerViking', reason: 'Exploit de recursos', expiresIn: 'Permanente' },
    { id: '5', user: 'Bot123', reason: 'Uso de bots', expiresIn: '7 días' },
  ]);

  public readonly searchQuery = signal<string>('');
  
  // Dummy users for the search simulation
  private readonly allUsers = [
    { username: 'LokiTrickster', status: 'Activo' },
    { username: 'Loki99', status: 'Activo' },
    { username: 'OdinAllfather', status: 'Activo' },
  ];

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
