import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';
import { LogoComponent } from '@shared/ui/logo';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '@pages/authentication/service/authentication.service';
import { ProfileMenuComponent } from '../profile-menu';

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
  ],
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
})
export class MainToolbarComponent {
  constructor(protected auth: AuthenticationService) {}
}
