import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { WhatsappMessageDeliveryStatus } from '@whatsapp/interface/whatsapp.message.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-message-delivery-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './message-delivery-status.component.html',
  styleUrls: ['./message-delivery-status.component.scss'],
})
export class MessageDeliveryStatusComponent {
  @Input()
  status: WhatsappMessageDeliveryStatus | undefined;
}
