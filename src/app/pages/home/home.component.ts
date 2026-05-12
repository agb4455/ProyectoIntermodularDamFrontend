import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { ClanPreview } from './home.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LogoComponent, RouterModule, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    // Permitimos que el usuario vea la home aunque esté logueado, 
    // pero los botones le llevarán al lobby en lugar de pedir login.
  }

  // Lista de clanes para la sección de previsualización
  protected readonly clans = signal<ClanPreview[]>([
    { id: 'berserkers',     name: 'Berserkers',     archetype: 'fury' },
    { id: 'valkirias',      name: 'Valkirias',      archetype: 'divine' },
    { id: 'jarls',          name: 'Jarls',          archetype: 'iron' },
    { id: 'sombras',        name: 'Sombras',        archetype: 'shadow' },
    { id: 'frost_guard',    name: 'Frost Guard',    archetype: 'frost' },
    { id: 'storm_bringers', name: 'Storm Bringers', archetype: 'storm' },
  ]);

  protected enterValhalla(): void {
    // Siempre navegamos al lobby; si no está logueado, el authGuard se encargará de pedir login
    this.router.navigate(['/lobby']);
  }

  protected getArchetypeIcon(archetype: string): string {
    switch (archetype) {
      case 'fury': return '⚔️';
      case 'divine': return '🛡️';
      case 'iron': return '⚒️';
      case 'shadow': return '🌑';
      case 'frost': return '❄️';
      case 'storm': return '⚡';
      default: return '🛡️';
    }
  }
}
