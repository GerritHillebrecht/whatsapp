import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Logout } from '@auth/store/authentication.actions';
import { AuthenticationState } from '@auth/store';
import { User } from '@angular/fire/auth';

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
  @Select(AuthenticationState.firebaseUser)
  firebaseUser$!: Observable<User | null>;

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(new Logout());
  }
}
