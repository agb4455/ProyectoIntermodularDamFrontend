import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-confirm-abandon-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="modal-overlay" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'GAME.MODALS.LEAVE_CONFIRM.TITLE' | translate }}</h2>
        </div>
        <div class="modal-body">
          <p class="warning-text">
            {{ 'GAME.MODALS.LEAVE_CONFIRM.BODY' | translate }}
          </p>
          <div class="viking-quote">
            {{ 'GAME.MODALS.LEAVE_CONFIRM.QUOTE' | translate }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="onCancel()">{{ 'GAME.MODALS.LEAVE_CONFIRM.BTN_STAY' | translate }}</button>
          <button class="btn-confirm" (click)="onConfirm()">{{ 'GAME.MODALS.LEAVE_CONFIRM.BTN_LEAVE' | translate }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use "../../../../styles/variables" as *;

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: $color-bg-overlay;
      display: flex; align-items: center; justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
      background: $color-bg-modal;
      border: 2px solid $color-error;
      border-radius: 12px;
      padding: 2rem;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 0 50px $color-error-bg;
      text-align: center;
    }

    .modal-title {
      color: $color-error;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      letter-spacing: 2px;
    }

    .warning-text {
      color: $color-text-secondary;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .viking-quote {
      font-style: italic;
      color: $color-gold-muted;
      font-size: 0.9rem;
      margin-bottom: 2rem;
      padding: 1rem;
      border-left: 3px solid $color-gold-muted;
      background: $color-gold-muted;
    }

    .modal-footer {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    button {
      padding: 1rem;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: $color-gold;
      color: $color-text-inverse;
      &:hover { filter: brightness(1.2); transform: scale(1.02); }
    }

    .btn-confirm {
      background: transparent;
      color: $color-error;
      border: 1px solid $color-error;
      &:hover { background: $color-error-bg; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmAbandonModalComponent {
  confirm = output<void>();
  cancel = output<void>();

  onConfirm() { this.confirm.emit(); }
  onCancel() { this.cancel.emit(); }
}
