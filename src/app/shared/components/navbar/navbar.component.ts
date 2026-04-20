import { Component, ChangeDetectionStrategy, signal, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthComponent } from '../auth/auth.component';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AuthComponent, LogoComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  // Inyección del servicio de autenticación para acceder al rol y sesión
  protected readonly authService = inject(AuthService);

  // Estado del dropdown — cerrado por defecto
  protected readonly dropdownOpen = signal<boolean>(false);

  // Estado del modal de autenticación
  protected readonly authModalOpen = signal<boolean>(false);

  /** Maneja el click en el avatar de usuario */
  protected handleUserClick(): void {
    if (this.authService.isLoggedIn()) {
      this.dropdownOpen.update(open => !open);
    } else {
      this.authModalOpen.set(true);
    }
  }

  /** Alterna el dropdown al pulsar el icono de usuario - solo si hay sesión */
  protected toggleDropdown(): void {
    if (!this.authService.isLoggedIn()) return;
    this.dropdownOpen.update(open => !open);
  }

  /** Cierra el dropdown al hacer click fuera de él */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Si el click no es dentro del menú de usuario, se cierra
    if (!target.closest('.user-menu')) {
      this.dropdownOpen.set(false);
    }
  }

  /** Cierra el dropdown tras navegar a una opción */
  protected closeDropdown(): void {
    this.dropdownOpen.set(false);
  }
}
