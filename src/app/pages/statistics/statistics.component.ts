import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatMetric } from './statistics.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  
  // Datos hardcodeados siguiendo el mockup y requerimientos
  // Estos datos se conectarán al backend en una fase posterior
  protected readonly stats = signal<StatMetric[]>([]);

  // Estátistica destacada para la "Barra" superior del contenedor
  protected readonly totalGlory = signal<string>('Gloria Eterna: 0');
}
