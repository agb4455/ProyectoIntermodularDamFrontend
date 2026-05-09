import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-attack-result-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="scrim" (click)="onClose()"></div>
    <div class="attack-result-modal">
      <header class="modal-header">
        <h2 class="modal-title">⚔️ {{ 'GAME.MODALS.REPORT.TITLE' | translate }}</h2>
        <button class="btn-close" (click)="onClose()">✕</button>
      </header>
      <div class="modal-body">
        <div class="stat-row">
          <span>{{ 'GAME.MODALS.REPORT.CAPITAL_DAMAGE' | translate }}</span>
          <span class="stat-val damage">{{ data().capitalDamage }}</span>
        </div>
        <div class="stat-row">
          <span>{{ 'GAME.MODALS.REPORT.ENEMY_DESTROYED' | translate }}</span>
          <span class="stat-val">{{ data().defenderTroopsDestroyed }}</span>
        </div>
        <div class="stat-row">
          <span>{{ 'GAME.MODALS.REPORT.OWN_LOSSES' | translate }}</span>
          <span class="stat-val losses">{{ data().attackerTroopsLost }}</span>
        </div>
        <div class="stat-row">
          <span>{{ 'GAME.MODALS.REPORT.RESEARCH_EARNED' | translate }}</span>
          <span class="stat-val research">+{{ data().researchCreditsEarned }} 🧪</span>
        </div>
        
        @if (data().defenderEliminated) {
          <div class="eliminated-banner">
            {{ 'GAME.MODALS.REPORT.ELIMINATED_BANNER' | translate }}
          </div>
        }
      </div>
      <footer class="modal-footer">
        <button class="btn-confirm" (click)="onClose()">{{ 'GAME.MODALS.REPORT.ACCEPT' | translate }}</button>
      </footer>
    </div>
  `,
  styles: [`
    @use "../../../../styles/variables" as *;

    .scrim {
      position: fixed;
      inset: 0;
      background: $color-bg-overlay;
      z-index: 2000;
      backdrop-filter: blur(4px);
    }

    .attack-result-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: $color-bg-modal;
      border: 2px solid $color-gold;
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      z-index: 2001;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 215, 0, 0.2);
      display: flex;
      flex-direction: column;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid $color-border-default;
      
      .modal-title {
        color: $color-gold;
        font-size: 1.25rem;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-close {
        background: transparent;
        border: none;
        color: $color-text-secondary;
        font-size: 1.2rem;
        cursor: pointer;
        transition: color 0.2s;
        
        &:hover { color: $color-error; }
      }
    }

    .modal-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed $color-border-faint;
      color: $color-text-primary;
      font-size: 0.95rem;

      &:last-of-type { border-bottom: none; }
    }

    .stat-val {
      font-weight: bold;
      &.damage { color: $color-error; }
      &.losses { color: $color-warning; }
      &.research { color: #a155ff; } /* A bit purple/blue for research */
    }

    .eliminated-banner {
      margin-top: 1rem;
      background: $color-error-bg;
      color: $color-error;
      padding: 0.8rem;
      text-align: center;
      font-weight: 900;
      letter-spacing: 2px;
      border: 1px solid $color-error;
      border-radius: 6px;
      text-transform: uppercase;
      animation: pulseAlert 2s infinite;
    }

    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid $color-border-default;
      display: flex;
      justify-content: center;
    }

    .btn-confirm {
      background: $color-gold;
      color: $color-text-inverse;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 6px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        filter: brightness(1.1);
        transform: scale(1.05);
      }
    }

    @keyframes popIn {
      0% { opacity: 0; transform: translate(-50%, -45%) scale(0.9); }
      100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes pulseAlert {
      0% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(255, 77, 77, 0); }
      100% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttackResultModalComponent {
  readonly data = input.required<any>();
  readonly closeModal = output<void>();

  protected onClose(): void {
    this.closeModal.emit();
  }
}
