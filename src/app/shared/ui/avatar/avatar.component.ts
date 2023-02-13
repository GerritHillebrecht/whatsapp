import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Input } from '@angular/core';

export interface AvatarImage {
  imageType: 'avif' | 'webp' | 'jpg';
  imageUrl: string;
}
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input()
  imageSrc: string | AvatarImage[] | null | undefined;

  @Input()
  size: number = 32;

  @Input()
  initials: string | null | undefined;

  @Input()
  cursor: string = 'auto';

  @Input()
  border: boolean = false;
}
