import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aviso-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aviso.modal.html',
  styleUrl: './aviso.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvisoModalComponent {
  // --- Inputs ---
  readonly message = input.required<string>();
  readonly title = input<string>('¡AVISO GUERRERO!');

  // --- Outputs ---
  readonly closeModal = output<void>();

  protected onClose(): void {
    this.closeModal.emit();
  }
}
