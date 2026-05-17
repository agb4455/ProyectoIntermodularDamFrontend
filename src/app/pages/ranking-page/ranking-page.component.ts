import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { StatisticsApiService, RankingUser } from '../../core/statistics/statistics-api.service';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-ranking-page',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './ranking-page.component.html',
  styleUrl: './ranking-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingPageComponent implements OnInit {
  private readonly statsApi = inject(StatisticsApiService);
  readonly i18n = inject(I18nService);

  readonly ranking = signal<RankingUser[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<boolean>(false);

  ngOnInit(): void {
    this.statsApi.getRanking().subscribe({
      next: (data) => {
        this.ranking.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching ranking:', err);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}
