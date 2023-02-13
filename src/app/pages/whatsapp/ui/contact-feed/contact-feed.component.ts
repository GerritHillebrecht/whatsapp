import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '../contact/contact.component';
import { Select, Store } from '@ngxs/store';
import {
  WhatsappState,
  WhatsappStateModel as WSM,
} from '@pages/whatsapp/store';
import { Observable } from 'rxjs';
import { WhatsappContact, WhatsappUser } from '@pages/whatsapp/interface';
import { ContactSearchBarComponent } from '../contact-search-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DarkmodeToggleComponent } from '@shared/ui/toogle/darkmode';
import { ScreenSizeService } from '@core/services/screen-size';
import { LogoComponent } from '@shared/ui/logo';
import { WhatsappContactState } from '@whatsapp/store/contact/contact.state';
import { RouterModule } from '@angular/router';
import { ContactSkeletonComponent } from './skeleton/contact-skeleton.component';
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
    LogoComponent,
    RouterModule,
    ContactSkeletonComponent,
  ],
  templateUrl: './contact-feed.component.html',
  styleUrls: ['./contact-feed.component.scss'],
})
export class ContactFeedComponent {
  @Select(WhatsappContactState.loadingState)
  syncLoading$: Observable<boolean> | undefined;

  @Select(WhatsappContactState.selectedContact)
  selectedContact$: Observable<WhatsappContact> | undefined;

  @Select(WhatsappContactState.contacts())
  contacts$: Observable<WhatsappContact[]> | undefined;

  constructor(
    protected screenSizeService: ScreenSizeService,
    private store: Store
  ) {}

  ngOnInit(): void {}

  trackByContactFn(index: number, contact: WhatsappContact): number {
    return contact.id;
  }
}
