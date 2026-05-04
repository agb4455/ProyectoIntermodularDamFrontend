import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClanDetail } from './characters.model';
import { GameService } from '../../core/game/game.service';
import { ClanData } from '../../core/game/game-api.service';

const ARCHETYPE_ICONS: Record<string, string> = {
  FURY: '🪓',
  DIVINE: '⚡',
  IRON: '🛡️',
  SHADOW: '👤',
  FROST: '❄️',
  STORM: '🌩️'
};

@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent implements OnInit {
  private readonly gameService = inject(GameService);
  protected readonly clans = signal<ClanDetail[]>([]);

  ngOnInit(): void {
    this.gameService.getClans().subscribe(clansData => {
      const mappedClans = clansData.map(clan => this.mapToClanDetail(clan, clansData));
      this.clans.set(mappedClans);
    });
  }

  private mapToClanDetail(clan: ClanData, allClans: ClanData[]): ClanDetail {
    const beatenBy = allClans
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
      icon: ARCHETYPE_ICONS[clan.archetype] || '⚔️'
    };
  }
}
