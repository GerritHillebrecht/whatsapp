import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { WhatsappUser } from '@pages/whatsapp/interface';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Logout } from '@auth/store/authentication.actions';

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
    MatDividerModule,
  ],
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent {
  @Select((state: any) => state.authentication.whatsappUser)
  whatsappUser$!: Observable<WhatsappUser | null>;

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
