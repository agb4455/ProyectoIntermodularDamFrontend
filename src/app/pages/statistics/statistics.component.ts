import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatMetric } from './statistics.model';
import { StatisticsApiService } from '../../core/statistics/statistics-api.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent implements OnInit {
  private readonly statsApi = inject(StatisticsApiService);
  private readonly i18n = inject(I18nService);
  
  // Datos hardcodeados siguiendo el mockup y requerimientos
  // Estos datos se conectarán al backend en una fase posterior
  protected readonly stats = signal<StatMetric[]>([]);
  protected readonly totalGlory = signal<string>('Gloria Eterna: 0');

  ngOnInit(): void {
    this.statsApi.getUserStats().subscribe(data => {
      this.totalGlory.set(`${this.i18n.translate('STATISTICS.GLORY')}: ${data.totalWins * 1000}`);
      
      const mappedStats: StatMetric[] = [
        { id: 'time', label: 'STATISTICS.TIME', value: `${data.totalPlayTimeMinutes} min`, icon: 'time' },
        { id: 'money', label: 'STATISTICS.MONEY', value: data.totalCreditsEarned.toString(), icon: 'money' },
        { id: 'trained', label: 'STATISTICS.TRAINED', value: data.totalTrained.toString(), icon: 'trained' },
        { id: 'deployed', label: 'STATISTICS.DEPLOYED', value: data.totalAttacks.toString(), icon: 'deployed' },
        { id: 'attacks', label: 'STATISTICS.ATTACKS', value: data.totalAttacks.toString(), icon: 'attacks' },
        { id: 'wins', label: 'STATISTICS.WINS', value: data.totalWins.toString(), icon: 'wins' }
      ];
      
      this.stats.set(mappedStats);
    });
  }
}
