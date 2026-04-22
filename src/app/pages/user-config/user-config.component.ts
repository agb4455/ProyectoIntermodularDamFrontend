import { ChangeDetectionStrategy, Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/theme/theme.service';
import { CambiarContrasenaModalComponent } from './modals/cambiar-contrasena.modal';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [CommonModule, FormsModule, CambiarContrasenaModalComponent],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserConfigComponent {
  // Signals para manejar el estado del usuario.
  // En producción estos vendrán de un AuthService / UserService.
  readonly userName = signal<string>('Ragnar Lothbrok');
  readonly userEmail = signal<string>('ragnar@vikingwars.com');
  readonly userClan = signal<string>('Jarl del Clan Furia');
  
  readonly language = signal<'ES' | 'EN'>('ES');
  
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

  // Acción: Alternar Idioma
  onChangeLanguage(): void {
    const newLang = this.language() === 'ES' ? 'EN' : 'ES';
    this.language.set(newLang);
    console.log('Idioma cambiado a:', newLang);
  }

  // Acción: Editar Foto de Perfil
  onEditAvatar(): void {
    console.log('Abriendo selector de avatar...');
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
    console.warn('[CONFIG] Envío de avatar preparado. El Middle Server procesará la imagen.');
  }

  // Acción: Guardar cambios en el servidor
  onSave(): void {
    console.log('Guardando cambios en el servidor...', {
      nombre: this.userName(),
      email: this.userEmail(),
      idioma: this.language(),
      darkMode: this.isDarkMode()
    });
    
    // TODO: Delegar persistencia al Middle Server (quien se comunica con el DB Server)
    console.info('[CONFIG] Solicitud de guardado preparada para el Middle Server.');
  }

  // Acción: Descartar cambios
  onCancel(): void {
    console.log('Cambios descartados');
    // Reiniciar valores o volver al Lobby
  }
}
