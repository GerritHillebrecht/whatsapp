import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from '@shared/ui/navigation/main-toolbar';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, MainToolbarComponent],
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.scss'],
})
export default class LandingLayoutComponent {}
