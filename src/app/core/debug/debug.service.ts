import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DebugService {

  // Controla la visibilidad global de las herramientas de debug
  readonly #isVisible = signal<boolean>(true); // Siempre visible en desarrollo por ahora
  readonly isVisible = this.#isVisible.asReadonly();

  toggle(): void {
    this.#isVisible.update(v => !v);
  }

  show(): void {
    this.#isVisible.set(true);
  }

  hide(): void {
    this.#isVisible.set(false);
  }
}
