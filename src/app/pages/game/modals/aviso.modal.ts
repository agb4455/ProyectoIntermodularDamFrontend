import { Component, ChangeDetectionStrategy, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/i18n/i18n.service';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-aviso-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './aviso.modal.html',
  styleUrl: './aviso.modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvisoModalComponent {
  private readonly i18n: I18nService = inject(I18nService);

  // --- Inputs ---
  readonly message = input.required<string>();
  readonly title = input<string>();

  protected readonly displayTitle = computed(() => this.title() ?? this.i18n.translate('GAME.MODALS.AVISO_TITLE'));

  // --- Outputs ---
  readonly closeModal = output<void>();

  protected onClose(): void {
    this.closeModal.emit();
  }
}
