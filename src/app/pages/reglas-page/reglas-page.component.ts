import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reglas-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reglas-page.component.html',
  styleUrl: './reglas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglasPageComponent {}
