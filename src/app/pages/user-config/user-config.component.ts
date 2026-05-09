import { ChangeDetectionStrategy, Component, signal, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/theme/theme.service';
import { I18nService, Language } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { CambiarContrasenaModalComponent } from './modals/cambiar-contrasena.modal';
import { AuthService } from '../../core/auth/auth.service';
import { AuthApiService } from '../../core/auth/auth-api.service';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [CommonModule, FormsModule, CambiarContrasenaModalComponent, TranslatePipe],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfigComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  
  // Datos reales del usuario autenticado
  readonly userName = computed(() => this.authService.username());
  readonly userEmail = signal<string>('');
  private originalEmail = '';
  readonly userClan = signal<string>('');  // El clan depende de la partida activa
  
  readonly i18n = inject(I18nService);
  private themeService = inject(ThemeService);
  readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');

  readonly showPasswordModal = signal(false);

  ngOnInit(): void {
    this.authApiService.getProfile().subscribe({
      next: (profile) => {
        this.userEmail.set(profile.email);
        this.originalEmail = profile.email;
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

  // Acción: Editar Foto de Perfil
  onEditAvatar(): void {
    // console.log('Abriendo selector de avatar...');
    this.prepareMinIOUpload();
  }

  /**
   * [PREPARADO] Envío de avatar al Middle Server
   * El Middle Server se encargará de:
   * 1. Redimensionar a 200x200 (sharp)
   * 2. Subir a MinIO
   * 3. Persistir la URL en el DB Server
   */
  private prepareMinIOUpload(): void {
    // TODO: Implementar input type="file" y enviar multipart/form-data al Middle Server
    // console.warn('[CONFIG] Envío de avatar preparado. El Middle Server procesará la imagen.');
  }

  // Acción: Guardar cambios en el servidor
  onSave(): void {
    const currentEmail = this.userEmail();
    if (currentEmail !== this.originalEmail) {
      this.authApiService.updateEmail(currentEmail).subscribe({
        next: () => {
          this.originalEmail = currentEmail;
          // Feedback de éxito (podría ser un toast)
        },
        error: (err) => {
          // Si es 409, el email ya está en uso
          const msg = err.status === 409 ? 'El email ya está registrado' : 'Error al actualizar email';
          alert(msg); // Placeholder para un Toast real
        }
      });
    }
  }

  // Acción: Descartar cambios
  onCancel(): void {
    this.userEmail.set(this.originalEmail);
  }
}
