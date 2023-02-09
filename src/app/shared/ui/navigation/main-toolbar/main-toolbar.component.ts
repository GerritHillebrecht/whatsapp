import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LogoComponent } from '@shared/ui/logo';
import { RouterModule } from '@angular/router';
import { ProfileMenuComponent } from '../profile-menu';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';

@Component({
  selector: 'app-main-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    LogoComponent,
    ProfileMenuComponent,
    DarkmodeToggleComponent,
  ],
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent {}
