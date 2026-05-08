import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/theme/theme.service';
import { I18nService, Language } from '../../core/i18n/i18n.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { CambiarContrasenaModalComponent } from './modals/cambiar-contrasena.modal';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [CommonModule, FormsModule, CambiarContrasenaModalComponent, TranslatePipe],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfigComponent {
  private readonly authService = inject(AuthService);
  
  // Datos reales del usuario autenticado
  readonly userName = computed(() => this.authService.username());
  readonly userEmail = signal<string>(''); // El email no está en el JWT actual, requiere endpoint /profile
  readonly userClan = signal<string>('');  // El clan depende de la partida activa
  
  readonly i18n = inject(I18nService);
  private themeService = inject(ThemeService);
  readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');

  readonly showPasswordModal = signal(false);

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
    /* console.log('Guardando cambios en el servidor...', {
      nombre: this.userName(),
      email: this.userEmail(),
      idioma: this.i18n.currentLang(),
      darkMode: this.isDarkMode()
    }); */
    
    // TODO: Delegar persistencia al Middle Server (quien se comunica con el DB Server)
    // console.info('[CONFIG] Solicitud de guardado preparada para el Middle Server.');
  }

  // Acción: Descartar cambios
  onCancel(): void {
    // console.log('Cambios descartados');
    // Reiniciar valores o volver al Lobby
  }
}
