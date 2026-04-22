import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-reglas-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './reglas.modal.html',
  styleUrl: './reglas.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReglasModalComponent {
  // --- Outputs ---
  readonly closeModal = output<void>();

  protected onClose(): void {
    this.closeModal.emit();
  }
}
