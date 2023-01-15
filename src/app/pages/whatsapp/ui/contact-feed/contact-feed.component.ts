import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { Select } from '@ngxs/store';
import { WhatsappStateModel as WSM } from '@pages/whatsapp/store';
import { Observable } from 'rxjs';
import { WhatsappContact } from '@pages/whatsapp/interface';
import { ContactSearchBarComponent } from '../contact-search-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';
import { ScreenSizeService } from '@core/services/screen-size';
import { LogoComponent } from '@shared/ui/logo';

@Component({
  selector: 'app-contact-feed',
  standalone: true,
  imports: [
    CommonModule,
    ContactComponent,
    ContactSearchBarComponent,
    MatIconModule,
    MatButtonModule,
    DarkmodeToggleComponent,
    LogoComponent
  ],
  templateUrl: './contact-feed.component.html',
  styleUrls: ['./contact-feed.component.scss'],
})
export class ContactFeedComponent {
  @Select(({ whatsapp }: { whatsapp: WSM }) =>
    whatsapp.contacts
      .filter((contact) => contact.lastMessage)
      .sort((a, b) => {
        return (
          new Date(b.lastMessage?.createdAt || new Date()).getTime() -
          new Date(a.lastMessage?.createdAt || new Date()).getTime()
        );
      })
  )
  contacts$: Observable<WhatsappContact[]> | undefined;

  @Select(({ whatsapp }: { whatsapp: WSM }) => whatsapp.selectedContact)
  selectedContact$: Observable<WhatsappContact> | undefined;

  constructor(protected screenSizeService: ScreenSizeService) {}
}
