import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LogoComponent } from '@shared/ui/logo';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '@pages/authentication/service/authentication.service';
import { ProfileMenuComponent } from '../profile-menu';
import { Select } from '@ngxs/store';
import { AuthenticationState } from '@auth/store';
import { Observable } from 'rxjs';
import { WhatsappUser } from '@whatsapp/interface';

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
  @Select(AuthenticationState.user)
  user$: Observable<WhatsappUser> | undefined;
}
