import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isModal = input(false);
  isLogin = signal(true);
  closeModal = output<void>();

  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  loading = signal(false);
  error = signal('');

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  toggleMode(): void {
    this.isLogin.update(v => !v);
    this.error.set('');
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.error.set('Por favor completa todos los campos correctamente');
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
        this.error.set('Error en el inicio de sesión. Inténtalo de nuevo.');
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.error.set('Por favor completa todos los campos correctamente');
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
        this.error.set('Error en el registro. Inténtalo de nuevo.');
      }
    });
  }
}
