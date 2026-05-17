import { Injectable, signal, computed } from '@angular/core';

/**
 * Variantes visuales del modal de notificación.
 * Cada una aplica un esquema de color y un icono diferente.
 */
export type ModalVariant = 'warning' | 'confirm' | 'success' | 'error' | 'info';

/**
 * Configuración completa de un modal de notificación.
 */
export interface ModalConfig {
  /** Variante visual (warning, confirm, success, error, info) */
  variant: ModalVariant;
  /** Título del modal */
  title: string;
  /** Mensaje del cuerpo del modal */
  message: string;
  /** Texto del botón principal (default: 'ENTENDIDO') */
  confirmText?: string;
  /** Texto del botón secundario (solo para 'confirm') */
  cancelText?: string;
  /** Callback ejecutado al pulsar el botón de confirmar */
  onConfirm?: () => void;
  /** Callback ejecutado al pulsar el botón de cancelar */
  onCancel?: () => void;
}

/**
 * Servicio global de modales de notificación.
 * Reemplaza los alert() y confirm() nativos del navegador
 * por modales temáticos Viking con diseño consistente.
 *
 * Se usa en combinación con NotificationModalComponent,
 * montado en app.html para estar siempre disponible.
 */
@Injectable({ providedIn: 'root' })
export class NotificationModalService {
  // Estado reactivo interno
  private readonly _config = signal<ModalConfig | null>(null);

  /** Configuración actual del modal (null = cerrado) */
  readonly config = this._config.asReadonly();

  /** Indica si el modal está abierto */
  readonly isOpen = computed(() => this._config() !== null);

  /**
   * Muestra un aviso de advertencia (reemplazo de alert() para warnings).
   * Icono: ⚠️ | Borde: ámbar/dorado
   */
  showWarning(title: string, message: string, onConfirm?: () => void): void {
    this._config.set({
      variant: 'warning',
      title,
      message,
      onConfirm
    });
  }

  /**
   * Muestra un modal de éxito.
   * Icono: ✓ | Borde: esmeralda
   */
  showSuccess(title: string, message: string, onConfirm?: () => void): void {
    this._config.set({
      variant: 'success',
      title,
      message,
      onConfirm
    });
  }

  /**
   * Muestra un modal de error.
   * Icono: ✕ | Borde: rojo
   */
  showError(title: string, message: string, onConfirm?: () => void): void {
    this._config.set({
      variant: 'error',
      title,
      message,
      onConfirm
    });
  }

  /**
   * Muestra un modal informativo.
   * Icono: ℹ | Borde: azul
   */
  showInfo(title: string, message: string, onConfirm?: () => void): void {
    this._config.set({
      variant: 'info',
      title,
      message,
      onConfirm
    });
  }

  /**
   * Muestra un modal de confirmación (reemplazo de confirm()).
   * Icono: ❓ | Borde: rojo/ámbar | Dos botones
   */
  showConfirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ): void {
    this._config.set({
      variant: 'confirm',
      title,
      message,
      onConfirm,
      onCancel,
      confirmText,
      cancelText
    });
  }

  /**
   * Cierra el modal activo.
   */
  close(): void {
    this._config.set(null);
  }
}
