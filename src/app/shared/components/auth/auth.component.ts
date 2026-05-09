import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isModal = input(false);
  isLogin = signal(true);
  closeModal = output<void>();

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly i18n = inject(I18nService);

  loading = signal(false);
  error = signal('');

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]]  // Sin minLength: la longitud mínima la valida el backend
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  toggleMode(): void {
    this.isLogin.update(v => !v);
    this.error.set('');
    // Reset forms when switching mode
    this.loginForm.reset();
    this.registerForm.reset();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.error.set(this.i18n.translate('AUTH.VALIDATION.REQUIRED_FIELDS'));
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.i18n.translate('AUTH.VALIDATION.LOGIN_ERROR'));
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.error.set(this.i18n.translate('AUTH.VALIDATION.REQUIRED_FIELDS'));
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { username, email, password } = this.registerForm.value;
    this.authService.register(username, email, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.closeModal.emit();
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 409 && err.error?.message) {
          this.error.set(err.error.message);
        } else {
          this.error.set(this.i18n.translate('AUTH.VALIDATION.REGISTER_ERROR'));
        }
      }
    });
  }
}
