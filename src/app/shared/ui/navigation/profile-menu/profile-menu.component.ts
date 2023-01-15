import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { WhatsappUser } from '@pages/whatsapp/interface';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthenticationService } from '@pages/authentication/service/authentication.service';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    DarkmodeToggleComponent,
    AvatarComponent,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent {
  @Select((state: any) => state.authentication.user)
  user$!: Observable<WhatsappUser>;

  constructor(protected auth: AuthenticationService) {}
}
