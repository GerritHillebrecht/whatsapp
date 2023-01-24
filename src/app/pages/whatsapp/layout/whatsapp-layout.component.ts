import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from '@core/services/screen-size';
import { Select } from '@ngxs/store';
import { WhatsappMessage } from '@whatsapp/interface';
import { WhatsappState } from '@whatsapp/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-whatsapp-layout',
  templateUrl: './whatsapp-layout.component.html',
  styleUrls: ['./whatsapp-layout.component.scss'],
})
export class WhatsappLayoutComponent implements OnInit {
  @Select(WhatsappState.messages)
  messages$: Observable<WhatsappMessage[]> | undefined;

  constructor(protected screenSizeService: ScreenSizeService) {}

  ngOnInit(): void {
    this.messages$?.subscribe((messages) => console.log('%cmessages', 'color: green; font-size: 30px;', messages));
  }
}
