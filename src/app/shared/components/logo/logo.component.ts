import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-wrapper" 
         [class.horizontal]="direction() === 'horizontal'" 
         [class.vertical]="direction() === 'vertical'"
         [style.transform]="'scale(' + scale() + ')'">
      <svg viewBox="0 0 100 100" class="mythic-logo" [attr.title]="'Viking Clan Wars Logo'">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:var(--color-gold-dark);stop-opacity:1" />
            <stop offset="50%" style="stop-color:var(--color-gold-light);stop-opacity:1" />
            <stop offset="100%" style="stop-color:var(--color-gold);stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Crossed Axes (Silhouette) -->
        <g class="axes" stroke="url(#gold-grad)" stroke-width="2" fill="none">
          <path d="M20 80 L80 20" /> 
          <path d="M80 80 L20 20" /> 
          <path d="M15 75 Q10 85 25 85 L25 75 Z" fill="url(#gold-grad)" /> 
          <path d="M85 75 Q90 85 75 85 L75 75 Z" fill="url(#gold-grad)" /> 
          <path d="M15 25 Q10 15 25 15 L25 25 Z" fill="url(#gold-grad)" /> 
          <path d="M85 25 Q90 15 75 15 L75 25 Z" fill="url(#gold-grad)" /> 
        </g>

        <!-- Central Wolf Head (Runic) -->
        <path class="wolf-head" 
              d="M50 25 L65 45 L50 85 L35 45 Z M50 25 L40 35 M50 25 L60 35 M50 85 L42 65 M50 85 L58 65" 
              fill="none" stroke="url(#gold-grad)" stroke-width="3" filter="url(#glow)"/>
        
        <!-- Runic Circles -->
        <circle cx="50" cy="50" r="45" stroke="url(#gold-grad)" stroke-width="0.5" stroke-dasharray="2 4" fill="none" opacity="0.5" />
        <circle cx="50" cy="50" r="38" stroke="url(#gold-grad)" stroke-width="1" fill="none" opacity="0.3" />
      </svg>
      @if (showText()) {
        <div class="logo-text">
          <span class="viking">VIKING</span>
          <span class="strategy">CLAN WARS</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .logo-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      user-select: none;
      
      &.vertical {
        flex-direction: column;
      }
      
      &.horizontal {
        flex-direction: row;
        gap: 15px;
        
        .logo-text {
          margin-top: 0;
          align-items: flex-start;
          transform: translateY(-2px);
        }
      }
    }
    .mythic-logo {
      width: 120px;
      height: 120px;
      filter: drop-shadow(0 0 10px var(--color-gold-muted));
    }
    .wolf-head {
      animation: runePulse 4s infinite ease-in-out;
    }
    .axes {
      opacity: 0.8;
    }
    .logo-text {
      margin-top: -8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      letter-spacing: 4px;
      pointer-events: none;
    }
    .viking {
      font-size: 24px;
      font-weight: 900;
      color: var(--color-gold);
      text-shadow: 0 0 15px var(--color-gold-muted);
      font-family: 'Outfit', sans-serif;
    }
    .strategy {
      font-size: 11px;
      font-weight: 400;
      color: var(--color-text-secondary);
      opacity: 0.9;
      margin-top: -2px;
    }
    @keyframes runePulse {
      0%, 100% { opacity: 0.7; stroke-width: 3; }
      50% { opacity: 1; stroke-width: 3.5; filter: drop-shadow(0 0 15px var(--color-gold-light)); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {
  readonly scale = input<number>(1);
  readonly showText = input<boolean>(true);
  readonly direction = input<'vertical' | 'horizontal'>('vertical');
}
