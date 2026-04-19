import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from '../../../core/debug/debug.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-global-debug',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-debug.component.html',
  styleUrl: './global-debug.component.scss'
})
export class GlobalDebugComponent {
  protected readonly debugService = inject(DebugService);
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);

  // Estados locales para el panel expandido
  protected isExpanded = false;

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleAuth(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.mockLogout();
    } else {
      this.authService.mockLogin('USER');
    }
  }

  toggleAdmin(): void {
    if (this.authService.isAdmin()) {
      this.authService.mockLogin('USER');
    } else {
      this.authService.mockLogin('ADMIN');
    }
  }
}
