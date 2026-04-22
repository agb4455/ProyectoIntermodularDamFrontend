import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contrasena-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">CAMBIAR CONTRASEÑA</h2>
          <button class="btn-close" (click)="onClose()">✕</button>
        </div>

        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label>Contraseña Actual</label>
            <input type="password" formControlName="currentPassword" placeholder="••••••••">
          </div>

          <div class="form-group">
            <label>Nueva Contraseña</label>
            <input type="password" formControlName="newPassword" placeholder="Mínimo 8 caracteres">
          </div>

          <div class="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input type="password" formControlName="confirmPassword" placeholder="Repite la contraseña">
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }
          
          @if (success()) {
            <div class="success-message">¡Contraseña actualizada con éxito!</div>
          }

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancelar</button>
            <button type="submit" class="btn-primary" [disabled]="passwordForm.invalid || loading()">
              {{ loading() ? 'Guardando...' : 'Actualizar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @use "../../../../styles/variables" as *;

    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: $color-bg-modal;
      border: 1px solid $color-gold;
      border-radius: 12px;
      width: 400px;
      max-width: 90%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex; justify-content: space-between; align-items: center;
    }

    .modal-title {
      color: $color-gold;
      font-size: 1.2rem;
      margin: 0;
      letter-spacing: 1px;
    }

    .btn-close {
      background: none; border: none; color: #666; font-size: 1.5rem; cursor: pointer;
      &:hover { color: $color-gold; }
    }

    .modal-body {
      padding: 1.5rem;
      display: flex; flex-direction: column; gap: 1.2rem;
    }

    .form-group {
      display: flex; flex-direction: column; gap: 0.5rem;
      label { font-size: 0.9rem; color: #aaa; }
      input {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        padding: 0.8rem; border-radius: 6px; color: #fff;
        &:focus { border-color: $color-gold; outline: none; }
      }
    }

    .error-message { color: $color-error; font-size: 0.85rem; }
    .success-message { color: $color-success; font-size: 0.85rem; }

    .modal-footer {
      display: flex; justify-content: flex-end; gap: 1rem;
      margin-top: 1rem;
    }

    button {
      padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: bold;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: transparent; border: 1px solid #444; color: #aaa;
      &:hover { border-color: #666; color: #fff; }
    }

    .btn-primary {
      background: $color-gold; border: none; color: #000;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { filter: brightness(1.1); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CambiarContrasenaModalComponent {
  closed = output<void>();
  
  loading = signal(false);
  error = signal('');
  success = signal(false);

  passwordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onClose() { this.closed.emit(); }

  onSubmit() {
    if (this.passwordForm.invalid) return;
    this.loading.set(true);
    
    // Simulación de cambio de contraseña
    setTimeout(() => {
      this.loading.set(false);
      this.success.set(true);
      setTimeout(() => this.onClose(), 2000);
    }, 1500);
  }
}
