import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="skeleton-yxy6k07iz5p"><div *ngIf="false"></div></div>',
  styles: [
    `
      .skeleton-yxy6k07iz5p:empty {
        --skeleton-background: transparent;
        --skeleton-color: #f5f7f9;

        position: relative;
        height: 400px;
        background-color: var(--skeleton-background);
        border-radius: 0px 0px 0px 0px;
        background-image: linear-gradient(var(--skeleton-color) 6px, transparent 0),
          linear-gradient(var(--skeleton-color) 6px, transparent 0),
          linear-gradient(var(--skeleton-color) 6px, transparent 0),
          linear-gradient(var(--skeleton-color) 6px, transparent 0),
          linear-gradient(var(--skeleton-color) 6px, transparent 0),
          radial-gradient(circle 20px at 20px 20px, var(--skeleton-color) 99%, transparent 0);
        background-repeat: repeat-y;
        background-size: 43% 133px, 90% 133px, 74% 133px, 52px 133px, 88px 133px,
          40px 133px;
        background-position: left 12px top 111px, left 12px top 92px,
          left 12px top 73px, left 59px top 39px, left 59px top 21px,
          left 12px top 12px;
      }
      .skeleton-yxy6k07iz5p:empty:before {
        content: ' ';
        position: absolute;
        z-index: 1000;
        width: 100%;
        height: 400px;
        -webkit-mask-image: linear-gradient(
          100deg,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 80%
        );
        -webkit-mask-repeat: repeat-y;
        -webkit-mask-size: 50px 400px;
        -webkit-mask-position: -20% 0;
        background-image: linear-gradient(
            rgba(102, 102, 102, 1) 6px,
            transparent 0
          ),
          linear-gradient(rgba(102, 102, 102, 1) 6px, transparent 0),
          linear-gradient(rgba(102, 102, 102, 1) 6px, transparent 0),
          linear-gradient(rgba(102, 102, 102, 1) 6px, transparent 0),
          linear-gradient(rgba(102, 102, 102, 1) 6px, transparent 0),
          radial-gradient(
            circle 20px at 20px 20px,
            rgba(102, 102, 102, 1) 99%,
            transparent 0
          );
        background-repeat: repeat-y;
        background-size: 43% 133px, 90% 133px, 74% 133px, 52px 133px, 88px 133px,
          40px 133px;
        background-position: left 12px top 111px, left 12px top 92px,
          left 12px top 73px, left 59px top 39px, left 59px top 21px,
          left 12px top 12px;
        animation: shineForSkeleton-yxy6k07iz5p 2s infinite;
      }
      @keyframes shineForSkeleton-yxy6k07iz5p {
        to {
          -webkit-mask-position: 120% 0;
        }
      }
    `,
  ],
})
export class ContactSkeletonComponent {
  constructor() {}
}
