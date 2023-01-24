import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circle-to-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-to-card.component.html',
  styleUrls: ['./circle-to-card.component.scss'],
})
export default class CircleToCardComponent {
  cards = Array.from({ length: 3 }).map((_, i) => i);
}
