import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappUser } from '@pages/whatsapp/interface';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Logout } from '@auth/store/authentication.actions';
import { WhatsappState } from '@whatsapp/store';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent {
  @Select(WhatsappState.whatsappUser)
  whatsappUser$!: Observable<WhatsappUser | null>;

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
