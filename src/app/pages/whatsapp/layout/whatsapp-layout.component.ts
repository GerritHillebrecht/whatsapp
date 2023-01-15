import { Component, OnInit } from '@angular/core';
import { ScreenSizeService } from '@core/services/screen-size';

@Component({
  selector: 'app-whatsapp-layout',
  templateUrl: './whatsapp-layout.component.html',
  styleUrls: ['./whatsapp-layout.component.scss'],
})
export class WhatsappLayoutComponent implements OnInit {
  constructor(protected screenSizeService: ScreenSizeService) {}

  ngOnInit(): void {}
}
