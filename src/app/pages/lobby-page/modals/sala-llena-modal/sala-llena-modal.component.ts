import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-sala-llena-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sala-llena-modal.component.html',
  styleUrl: './sala-llena-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalaLlenaModalComponent {
  // Output para notificar al padre que debe cerrar el modal
  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }
}
