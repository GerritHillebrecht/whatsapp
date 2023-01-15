import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FontAwesomeModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  logo = faWhatsapp;
  size: SizeProp = 'xl';
}
