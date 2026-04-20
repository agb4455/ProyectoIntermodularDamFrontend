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

  onChangeLanguage(): void {
    console.log('Change language clicked');
    const newLang = this.language() === 'ES' ? 'EN' : 'ES';
    this.language.set(newLang);
  }

  onEditAvatar(): void {
    console.log('Edit avatar clicked');
    // Implement avatar edit logic
  }

  onSave(): void {
    console.log('Settings saved:', {
      userName: this.userName(),
      userEmail: this.userEmail(),
      language: this.language(),
      isDarkMode: this.isDarkMode()
    });
    // Implement actual backend save logic here
  }

  onCancel(): void {
    console.log('Settings cancelled');
    // Reset or navigate away
  }
}
