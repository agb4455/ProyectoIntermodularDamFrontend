import { Component, signal, inject, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { GlobalDebugComponent } from './shared/components/debug/global-debug.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, GlobalDebugComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ProyectoIntermodularDamFrontend');
  
  private readonly router = inject(Router);
  
  // Track the current URL from router events
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: '/' }
  );

  // Compute whether to show navbar (hidden on game screens)
  protected readonly showNavbar = computed(() => {
    const url = this.currentUrl();
    return !url.startsWith('/game');
  });
}
