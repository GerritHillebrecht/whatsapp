import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { WhatsappMessage, WhatsappUser } from '@pages/whatsapp/interface';
import { MessageDeliveryStatusComponent } from '../message-delivery-status';
import { MessageService } from '@whatsapp/service';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, MessageDeliveryStatusComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements AfterViewInit {
  @ViewChild('messageRef')
  messageRef: ElementRef<HTMLDivElement> | undefined;

  @Input()
  message: WhatsappMessage | undefined;

  @Select((state: any) => state.authentication.whatsappUser)
  user$: Observable<WhatsappUser> | undefined;

  constructor(private service: MessageService) {}

  ngAfterViewInit(): void {
    this.messageRef!.nativeElement.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      // this.service.showContextMenu(event, this.message!);
    });
  }
}
