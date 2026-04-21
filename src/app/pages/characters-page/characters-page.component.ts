import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClanDetail } from './characters.model';

@Component({
  selector: 'app-characters-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersPageComponent {
  protected readonly clans = signal<ClanDetail[]>([
    {
      id: 'berserkers',
      name: 'Berserkers',
      archetype: 'Fury',
      description: 'Guerreros dominados por la furia ciega, capaces de ignorar el dolor para despedazar a sus enemigos.',
      beats: 'Skalds',
      beatsReason: 'La rabia primigenia silencia las melodías místicas.',
      beatenBy: 'Jarls',
      colorVar: '--color-clan-fury',
      icon: '⚔️'
    },
    {
      id: 'skalds',
      name: 'Skalds',
      archetype: 'Song',
      description: 'Poetas guerreros cuyas canciones inspiran a los aliados y aterran a los enemigos con rimas ancestrales.',
      beats: 'Draugr',
      beatsReason: 'Las armonías divinas traen paz y descanso a los muertos inquietos.',
      beatenBy: 'Berserkers',
      colorVar: '--color-clan-song',
      icon: '🎼'
    },
    {
      id: 'draugr',
      name: 'Draugr',
      archetype: 'Death',
      description: 'Caminantes de tumbas liberados de las garras de Hel para reclamar las tierras de los vivos.',
      beats: 'Valkirias',
      beatsReason: 'La entropía de Helheim consume incluso la luz celestial.',
      beatenBy: 'Skalds',
      colorVar: '--color-clan-death',
      icon: '💀'
    },
    {
      id: 'valkirias',
      name: 'Valkirias',
      archetype: 'Divine',
      description: 'Elegidas de Odín, guardianas del Valhalla que descienden de los cielos con alas de luz.',
      beats: 'Seidr',
      beatsReason: 'La autoridad celestial anula las runas primigenias antiguas.',
      beatenBy: 'Draugr',
      colorVar: '--color-clan-divine',
      icon: '🛡️'
    },
    {
      id: 'seidr',
      name: 'Seidr',
      archetype: 'Rune',
      description: 'Maestros de la hechicería rúnica, capaces de tejer el destino y manipular las leyes de la naturaleza.',
      beats: 'Jarls',
      beatsReason: 'La magia esquiva y corrompe el acero más resistente.',
      beatenBy: 'Valkirias',
      colorVar: '--color-clan-rune',
      icon: '🔮'
    },
    {
      id: 'jarls',
      name: 'Jarls',
      archetype: 'Iron',
      description: 'Señores de la guerra disciplinados, expertos en el uso del acero y la táctica defensiva inexpugnable.',
      beats: 'Berserkers',
      beatsReason: 'El acero disciplinado y las armaduras pesadas resisten la rabia salvaje.',
      beatenBy: 'Seidr',
      colorVar: '--color-clan-iron',
      icon: '⚒️'
    }
  ]);
}
