import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappContact } from '@pages/whatsapp/interface';
import { AvatarComponent } from '@shared/ui/avatar';
import { Store } from '@ngxs/store';
import { SelectContact } from '@pages/whatsapp/store';
import { ScreenSizeService } from '@core/services/screen-size';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, AvatarComponent, RouterModule],
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
    return this.store.dispatch(new SelectContact(this.contact!));
  }
}
