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
   * [PREPARADO] Lógica de subida a MinIO
   * Incluye validación de Magic Bytes y redimensionado a 200x200
   */
  private prepareMinIOUpload(): void {
    // TODO: Usar biblioteca 'sharp' o canvas para redimensionar a 200x200
    // TODO: Obtener URL firmada (PUT) desde el Middle Server
    // TODO: Subir directamente a MinIO
    console.warn('[CONFIG] Subida a MinIO preparada. Falta integración con Middle Server.');
  }

  // Acción: Guardar cambios en el servidor
  onSave(): void {
    console.log('Guardando cambios en el servidor...', {
      nombre: this.userName(),
      email: this.userEmail(),
      idioma: this.language(),
      darkMode: this.isDarkMode()
    });
    
    // TODO: Implementar interceptor HTTP para añadir Bearer Token
    // TODO: Llamada REST al DB Server via Middle Server (/internal/users/{id})
    console.info('[CONFIG] Persistencia preparada. Esperando endpoints del DB Server.');
  }

  // Acción: Descartar cambios
  onCancel(): void {
    console.log('Cambios descartados');
    // Reiniciar valores o volver al Lobby
  }
}
