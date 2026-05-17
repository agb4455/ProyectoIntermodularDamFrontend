import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NotificationModalService } from '../../services/notification-modal.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

/**
 * Modal global de notificaciones.
 * Montado en app.html para estar siempre disponible en toda la aplicación.
 * Soporta 5 variantes: warning, confirm, success, error, info.
 */
@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './notification-modal.component.html',
  styleUrl: './notification-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationModalComponent {
  protected readonly modalService = inject(NotificationModalService);
  private readonly i18n = inject(I18nService);

  /** Configuración actual del modal (null = cerrado) */
  protected readonly config = this.modalService.config;

  /** Indica si el modal está abierto */
  protected readonly isOpen = this.modalService.isOpen;

  /** Texto del botón principal según variante */
  protected readonly confirmButtonText = computed(() => {
    const cfg = this.config();
    if (!cfg) return '';
    if (cfg.confirmText) return cfg.confirmText;

    switch (cfg.variant) {
      case 'confirm':
        return this.i18n.translate('SHARED.MODAL.BTN_CONFIRM');
      default:
        return this.i18n.translate('SHARED.MODAL.BTN_OK');
    }
  });

  /** Texto del botón de cancelar (solo para confirm) */
  protected readonly cancelButtonText = computed(() => {
    const cfg = this.config();
    if (!cfg) return '';
    return cfg.cancelText ?? this.i18n.translate('SHARED.MODAL.BTN_CANCEL');
  });

  /** Confirmar y cerrar */
  protected onConfirm(): void {
    const cfg = this.config();
    if (cfg?.onConfirm) {
      cfg.onConfirm();
    }
    this.modalService.close();
  }

  /** Cancelar y cerrar (solo confirm) */
  protected onCancel(): void {
    const cfg = this.config();
    if (cfg?.onCancel) {
      cfg.onCancel();
    }
    this.modalService.close();
  }

  /** Cerrar mediante clic en el scrim */
  protected onScrimClick(): void {
    const cfg = this.config();
    if (cfg?.variant === 'confirm') {
      // Para confirm, el scrim actúa como cancelar
      this.onCancel();
    } else {
      this.onConfirm();
    }
  }
}
