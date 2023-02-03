import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from '@shared/ui/navigation/main-toolbar';
import { LibrariesSectionComponent } from '../sections/libraries-section/libraries-section.component';
import { PhoneMaskSectionComponent } from '../sections/phone-mask-section/phone-mask-section.component';

@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [
    CommonModule,
    MainToolbarComponent,
    PhoneMaskSectionComponent,
    LibrariesSectionComponent,
  ],
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.scss'],
})
export default class LandingLayoutComponent {}
