import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-selector',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.scss'],
})
export class ImageSelectorComponent {
  @Input()
  messageForm!: FormGroup;

  imageSrc: string | ArrayBuffer | null = null;

  readFile(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    if (!files) return;

    const file = files[0];

    const reader = new FileReader();
    reader.onload = (e) => (this.imageSrc = reader.result);
    reader.readAsDataURL(file);

    this.messageForm.get('image')?.setValue(file);

    const messages = [
      {
        body: 'Hello, world!',
        isMine: true
      },
      {
        body: 'Hello, world!',
        isMine: true
      },
      {
        body: 'Hello, world!',
        isMine: false
      },
      {
        body: 'Hello, world!',
        isMine: false
      },
      {
        body: 'Hello, world!',
        isMine: true
      },
      {
        body: 'Hello, world!',
        isMine: true
      },
    ]

    
  }

  removeImage(): void {
    this.imageSrc = null;
    this.messageForm.get('image')?.reset();
  }
}
