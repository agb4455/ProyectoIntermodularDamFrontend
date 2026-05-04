import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClanDetail } from './characters.model';
import { CLANS_DATA } from '../../core/game/clans.data';

@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent {
  protected readonly clans = signal<ClanDetail[]>(this.mapClans());

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
        icon: ARCHETYPE_ICONS[clan.archetype] || '⚔️'
      };
    });
  }
}
