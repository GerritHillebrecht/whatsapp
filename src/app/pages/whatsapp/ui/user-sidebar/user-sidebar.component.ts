import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { ProfileMenuComponent } from '@shared/ui/navigation/profile-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    DarkmodeToggleComponent,
    ProfileMenuComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss'],
})
export class UserSidebarComponent {}
