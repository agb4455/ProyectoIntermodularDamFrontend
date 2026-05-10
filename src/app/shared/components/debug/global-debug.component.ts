import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebugService } from '../../../core/debug/debug.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ThemeService } from '../../../core/theme/theme.service';

import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-global-debug',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
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

}
