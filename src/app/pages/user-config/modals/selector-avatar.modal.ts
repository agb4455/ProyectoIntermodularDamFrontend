import { Component, ChangeDetectionStrategy, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../../core/auth/auth-api.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-selector-avatar-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ 'CONFIG.CHOOSE_AVATAR' | translate | uppercase }}</h2>
          <button class="btn-close" (click)="onClose()">✕</button>
        </div>

        <div class="modal-body">
          <div class="avatar-grid">
            @for (avatar of predefinedAvatars; track avatar) {
              <div class="avatar-option" (click)="selectPredefined(avatar)">
                <img [src]="avatar" alt="Viking Option">
              </div>
            }
          </div>

          <div class="divider">
            <span>{{ 'OR' | translate }}</span>
          </div>

          <div class="custom-upload">
            <button class="btn-upload" (click)="fileInput.click()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {{ 'CONFIG.UPLOAD_CUSTOM' | translate }}
            </button>
            <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none">
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use "../../../../styles/variables" as *;

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.85);
      display: flex; align-items: center; justify-content: center;
      z-index: 2100;
      backdrop-filter: blur(8px);
    }

    .modal-content {
      background: rgba(15, 15, 20, 0.95);
      border: 1px solid $color-gold;
      border-radius: 16px;
      width: 480px;
      max-width: 90%;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba($color-gold, 0.2);
      animation: modalFadeIn 0.3s ease-out;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba($color-gold, 0.2);
      display: flex; justify-content: space-between; align-items: center;
    }

    .modal-title {
      color: $color-gold;
      font-family: 'Cinzel', serif;
      font-size: 1.3rem;
      margin: 0;
      letter-spacing: 2px;
    }

    .btn-close {
      background: none; border: none; color: $color-text-secondary; font-size: 1.5rem; cursor: pointer;
      transition: color 0.2s;
      &:hover { color: $color-gold; }
    }

    .modal-body {
      padding: 2rem;
      display: flex; flex-direction: column; gap: 2rem;
    }

    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .avatar-option {
      aspect-ratio: 1;
      border-radius: 50%;
      border: 2px solid transparent;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(255, 255, 255, 0.05);

      img { width: 100%; height: 100%; object-fit: cover; }

      &:hover {
        transform: scale(1.1);
        border-color: $color-gold;
        box-shadow: 0 0 15px rgba($color-gold, 0.4);
      }
    }

    .divider {
      display: flex; align-items: center; gap: 1rem;
      color: $color-text-secondary;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;

      &::before, &::after {
        content: ''; flex: 1; height: 1px; background: rgba($color-gold, 0.1);
      }
    }

    .custom-upload {
      display: flex; justify-content: center;
    }

    .btn-upload {
      display: flex; align-items: center; gap: 0.8rem;
      background: rgba($color-gold, 0.1);
      border: 1px dashed $color-gold;
      color: $color-gold;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.2s;

      svg { width: 20px; height: 20px; }

      &:hover {
        background: rgba($color-gold, 0.2);
        transform: translateY(-2px);
      }
    }

    .error-message {
      color: $color-error;
      font-size: 0.9rem;
      text-align: center;
      background: rgba($color-error, 0.1);
      padding: 0.8rem;
      border-radius: 6px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectorAvatarModalComponent {
  closed = output<void>();
  avatarSelected = output<string>();
  
  private readonly authApiService = inject(AuthApiService);
  error = signal('');

  readonly predefinedAvatars = [
    '/avatars/viking-1.png',
    '/avatars/viking-2.png',
    '/avatars/viking-3.png',
    '/avatars/viking-4.png',
    '/avatars/viking-5.png',
    '/avatars/viking-6.png',
    '/avatars/viking-7.png',
    '/avatars/viking-8.png'
  ];

  onClose() { this.closed.emit(); }

  selectPredefined(url: string) {
    this.authApiService.updateAvatarUrl(url).subscribe({
      next: (res) => {
        this.avatarSelected.emit(res.avatarUrl);
        this.onClose();
      },
      error: () => {
        this.error.set('Error al guardar el avatar predefinido');
      }
    });
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    if (file) {
      this.authApiService.uploadAvatar(file).subscribe({
        next: (res) => {
          this.avatarSelected.emit(res.avatarUrl);
          this.onClose();
        },
        error: (err) => {
          const msg = err.status === 413 ? 'Imagen demasiado grande (máx 5MB)' : 'Error al subir imagen';
          this.error.set(msg);
        }
      });
    }
  }
}
