import { Component } from '@angular/core';
import { ScreenSizeService } from '@core/services/screen-size';

@Component({
  selector: 'app-whatsapp-layout',
  templateUrl: './whatsapp-layout.component.html',
  styleUrls: ['./whatsapp-layout.component.scss'],
})
export class WhatsappLayoutComponent {
  constructor(protected screenSizeService: ScreenSizeService) {}
}
