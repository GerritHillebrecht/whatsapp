import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappContact } from '@pages/whatsapp/interface';
import { AvatarComponent } from '@shared/ui/avatar';
import { Store } from '@ngxs/store';
import { ScreenSizeService } from '@core/services/screen-size';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SelectWhatsappContact } from '@whatsapp/store/contact/contact.actions';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RouterModule, MatIconModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @Input()
  contact: WhatsappContact | undefined;

  @Input()
  active: boolean = false;

  constructor(
    private store: Store,
    protected screenSize: ScreenSizeService,
    private router: Router
  ) {}

  async clickHandler() {
    if (await firstValueFrom(this.screenSize.twSm$)) {
      this.router.navigate(['whatsapp', 'chat']);
    }
    return this.store.dispatch(new SelectWhatsappContact(this.contact!));
  }
}
