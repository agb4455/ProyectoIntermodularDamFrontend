import { Injectable, signal, effect } from '@angular/core';

type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  // Estado del tema — dark por defecto si el sistema no indica preferencia
  readonly #theme = signal<Theme>(this.#getInitialTheme());
  readonly theme = this.#theme.asReadonly();

  constructor() {
    // Aplicar el atributo data-theme al <html> cuando cambie el signal
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.#theme());
      localStorage.setItem('theme', this.#theme());
    });
  }

  toggle(): void {
    this.#theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.#theme.set(theme);
  }

  #getInitialTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
