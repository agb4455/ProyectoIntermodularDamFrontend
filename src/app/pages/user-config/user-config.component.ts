import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  readonly isDarkMode = signal<boolean>(true);

  // Acción: Gestionar / Cambiar Contraseña
  onChangePassword(): void {
    console.log('Navegando a cambio de contraseña...');
    // TODO: Abrir modal cambiarContraseña especificado en ui_screens.md
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
    // TODO: Implementar lógica de subida a MinIO (Magic bytes + resize 200x200)
  }

  // Acción: Guardar cambios en el servidor
  onSave(): void {
    console.log('Guardando cambios en el servidor...', {
      nombre: this.userName(),
      email: this.userEmail(),
      idioma: this.language(),
      darkMode: this.isDarkMode()
    });
    // TODO: Llamada REST al DB Server via Middle Server
  }

  // Acción: Descartar cambios
  onCancel(): void {
    console.log('Cambios descartados');
    // Reiniciar valores o volver al Lobby
  }
}
