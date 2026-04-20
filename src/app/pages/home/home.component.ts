import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { CommonModule } from '@angular/common';

interface ClanPreview {
  id: string;
  name: string;
  archetype: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Lista de clanes para la sección de previsualización
  protected readonly clans = signal<ClanPreview[]>([
    { id: 'berserkers', name: 'Berserkers', archetype: 'fury' },
    { id: 'valkirias', name: 'Valkirias', archetype: 'divine' },
    { id: 'jarls', name: 'Jarls', archetype: 'iron' },
    { id: 'skalds', name: 'Skalds', archetype: 'song' },
    { id: 'seidr', name: 'Seidr', archetype: 'rune' },
    { id: 'draugr', name: 'Draugr', archetype: 'death' },
  ]);

  protected enterValhalla(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/game']);
    } else {
      // Como el modal de auth está en la Navbar, podríamos disparar un evento global
      // o simplemente navegar a /lobby y que el guard de auth (si existiera) lo pida.
      // Aquí, por simplicidad y siguiendo la estructura actual, navegamos a lobby.
      this.router.navigate(['/game']);
    }
  }

  protected getArchetypeIcon(archetype: string): string {
    switch (archetype) {
      case 'fury': return '⚔️';
      case 'divine': return '🛡️';
      case 'iron': return '⚒️';
      case 'song': return '🎼';
      case 'rune': return '🔮';
      case 'death': return '💀';
      default: return '❄️';
    }
  }
}
