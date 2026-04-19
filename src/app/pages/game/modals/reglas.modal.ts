import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reglas-modal',
  standalone: true,
  imports: [CommonModule],
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
