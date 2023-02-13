import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { WhatsappMessage, WhatsappUser } from '@pages/whatsapp/interface';
import { MessageDeliveryStatusComponent } from '../message-delivery-status';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WhatsappState } from '@whatsapp/store';
import { StorageService } from '@whatsapp/service/storage/storage.service';
import { MessageImage } from '@whatsapp/interface/whatsapp.message.interface';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, MessageDeliveryStatusComponent],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Select(WhatsappState.whatsappUser)
  user$: Observable<WhatsappUser> | undefined;

  @Input()
  message: WhatsappMessage | undefined;

  @Input()
  index: number = 0;

  imageSrc: MessageImage[] | undefined;
  imageFallbackSrc: string | undefined;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    if (this.message?.image) {
      this.storageService
        .getImages(this.message.image, this.message.uuid)
        .then((images) => {
          this.imageSrc = images;
          this.imageFallbackSrc = images.at(-1)?.filename;
        });
    }
  }
}
