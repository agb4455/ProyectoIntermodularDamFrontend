import { Component, ChangeDetectionStrategy, signal, inject, HostListener, effect } from '@angular/core';
import { RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  // Estado del dropdown — cerrado por defecto
  protected readonly dropdownOpen = signal<boolean>(false);

  // Estado del modal de autenticación
  protected readonly authModalOpen = signal<boolean>(false);

  // Estado del menú móvil
  protected readonly mobileMenuOpen = signal<boolean>(false);

  constructor() {
    // Escuchamos parámetros de consulta para abrir el modal si es necesario
    // Usamos un effect para reaccionar a los cambios de queryParams (que es un Observable)
    // Pero como queryParams es un observable, mejor nos suscribimos en el constructor o ngOnInit.
    this.route.queryParams.subscribe(params => {
      if (params['login'] === 'true' && !this.authService.isLoggedIn()) {
        this.authModalOpen.set(true);
      }
    });
  }

  /** Maneja el click en el avatar de usuario */
  protected handleUserClick(): void {
    const isMobile = window.innerWidth <= 950;

    if (this.authService.isLoggedIn()) {
      if (isMobile) {
        this.toggleMobileMenu();
      } else {
        this.dropdownOpen.update(open => !open);
      }
    } else {
      if (isMobile) this.closeMobileMenu();
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

  /** Alterna el menú móvil */
  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  /** Cierra el menú móvil */
  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
