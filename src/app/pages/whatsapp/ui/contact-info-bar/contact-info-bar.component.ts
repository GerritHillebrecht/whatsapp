import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WhatsappContact } from '@whatsapp/interface';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AvatarComponent } from '@shared/ui/avatar/avatar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ScreenSizeService } from '@core/services/screen-size';
import { WhatsappContactState } from '@whatsapp/store';

@Component({
  selector: 'app-contact-info-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    AvatarComponent,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './contact-info-bar.component.html',
  styleUrls: ['./contact-info-bar.component.scss'],
})
export class ContactInfoBarComponent {
  @Select(WhatsappContactState.selectedContact)
  contact$: Observable<WhatsappContact> | undefined;

  constructor(protected screenSize: ScreenSizeService) {}
}
