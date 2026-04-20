import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigComponent {
  // Placeholder signals. These should be wired up to a UserService / AuthService later.
  readonly userName = signal<string>('Viking Warrior');
  readonly userEmail = signal<string>('viking@valhalla.com');
  
  readonly language = signal<'ES' | 'EN'>('ES');
  readonly isDarkMode = signal<boolean>(true); // Assuming dark mode by default given the theme

  onChangePassword(): void {
    console.log('Change password clicked');
    // Implement password change logic or open a modal
  }

  onChangeEmail(): void {
    console.log('Change email clicked');
    // Implement email change logic
  }

  onEditAvatar(): void {
    console.log('Edit avatar clicked');
    // Implement avatar edit logic
  }

  onSave(): void {
    console.log('Settings saved:', {
      language: this.language(),
      isDarkMode: this.isDarkMode()
    });
    // Implement save logic
  }

  onCancel(): void {
    console.log('Settings cancelled');
    // Implement cancel logic (e.g., reset signals to original state or navigate away)
  }
}
