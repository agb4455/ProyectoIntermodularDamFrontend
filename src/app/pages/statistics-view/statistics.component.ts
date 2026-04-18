import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para definir una métrica de estadística
 */
export interface StatMetric {
  id: string;
  label: string;
  value: string;
  icon: string; // Tipo de icono o path a SVG
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsComponent {
  
  // Datos hardcodeados siguiendo el mockup y requerimientos
  // Estos datos se conectarán al backend en una fase posterior
  protected readonly stats = signal<StatMetric[]>([
    {
      id: 'time',
      label: 'Tiempo de juego total',
      value: '14h 25m',
      icon: 'time'
    },
    {
      id: 'money',
      label: 'Dinero total gastado',
      value: '124.500',
      icon: 'money'
    },
    {
      id: 'trained',
      label: 'Tropas entrenadas',
      value: '1.240',
      icon: 'trained'
    },
    {
      id: 'deployed',
      label: 'Tropas desplegadas',
      value: '850',
      icon: 'deployed'
    },
    {
      id: 'attacks',
      label: 'Ataques realizados',
      value: '312',
      icon: 'attacks'
    },
    {
      id: 'wins',
      label: 'Partidas ganadas',
      value: '24',
      icon: 'wins'
    }
  ]);

  // Estátistica destacada para la "Barra" superior del contenedor
  protected readonly totalGlory = signal<string>('Gloria Eterna: 4.800');
}
