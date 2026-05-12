import { ChangeDetectionStrategy, Component, signal, inject, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/theme/theme.service';
import { I18nService, Language } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { CambiarContrasenaModalComponent } from './modals/cambiar-contrasena.modal';
import { SelectorAvatarModalComponent } from './modals/selector-avatar.modal';
import { AuthService } from '../../core/auth/auth.service';
import { AuthApiService } from '../../core/auth/auth-api.service';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [CommonModule, FormsModule, CambiarContrasenaModalComponent, SelectorAvatarModalComponent, TranslatePipe],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfigComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);
  
  // Datos reales del usuario autenticado
  readonly userName = computed(() => this.authService.username());
  readonly userEmail = signal<string>('');
  private originalEmail = '';
  readonly userClan = signal<string>('');  // El clan depende de la partida activa
  
  readonly i18n = inject(I18nService);
  private themeService = inject(ThemeService);
  readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');

  readonly showPasswordModal = signal(false);
  readonly showAvatarModal = signal(false);

  ngOnInit(): void {
    this.authApiService.getProfile().subscribe({
      next: (profile) => {
        this.userEmail.set(profile.email);
        this.originalEmail = profile.email;
        if (profile.avatarUrl) {
          this.authService.updateAvatarUrl(profile.avatarUrl);
        }
      },
      error: () => {
        // Ignorar error y dejar en blanco
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  // Acción: Gestionar / Cambiar Contraseña
  onChangePassword(): void {
    this.showPasswordModal.set(true);
  }

  onPasswordModalClosed(): void {
    this.showPasswordModal.set(false);
  }

  // Acción: Seleccionar Idioma
  setLanguage(lang: string): void {
    this.i18n.setLanguage(lang.toLowerCase() as Language);
  }

  // Acción: Abrir selector de avatar
  onEditAvatar(): void {
    this.showAvatarModal.set(true);
  }

  onAvatarSelected(url: string): void {
    this.authService.updateAvatarUrl(url);
    this.showAvatarModal.set(false);
  }

  onAvatarModalClosed(): void {
    this.showAvatarModal.set(false);
  }

  // Acción: Guardar cambios en el servidor
  onSave(): void {
    const currentEmail = this.userEmail();
    if (currentEmail !== this.originalEmail) {
      this.authApiService.updateEmail(currentEmail).subscribe({
        next: () => {
          this.originalEmail = currentEmail;
          this.router.navigate(['/lobby']);
        },
        error: (err) => {
          const msg = err.status === 409 ? 'El email ya está registrado' : 'Error al actualizar email';
          alert(msg);
        }
      });
    } else {
      // Si no hay cambios, simplemente volvemos al lobby
      this.router.navigate(['/lobby']);
    }
  }

  // Acción: Descartar cambios
  onCancel(): void {
    this.userEmail.set(this.originalEmail);
    this.router.navigate(['/lobby']);
  }
}
