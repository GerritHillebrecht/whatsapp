import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { WhatsappMessage } from '@pages/whatsapp/interface';
import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MessageComposerComponent } from '../message-composer';
import { ContactInfoBarComponent } from '../contact-info-bar';
import { ScreenSizeService } from '@core/services/screen-size';
import { WhatsappMessageState } from '@whatsapp/store/message/message.state';

@Component({
  selector: 'app-message-feed',
  standalone: true,
  imports: [
    CommonModule,
    MessageComponent,
    MessageComposerComponent,
    ContactInfoBarComponent,
  ],
  templateUrl: './message-feed.component.html',
  styleUrls: ['./message-feed.component.scss'],
})
export class MessageFeedComponent implements AfterViewInit {
  @ViewChild('scroller')
  scroller: ElementRef<HTMLDivElement> | undefined;

  @ViewChild('messageContainer')
  messageContainer: ElementRef<HTMLDivElement> | undefined;

  @Select(WhatsappMessageState.messages())
  messages$: Observable<WhatsappMessage[] | null> | undefined;

  constructor(protected screenSizeService: ScreenSizeService) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  protected trackByMessageFn(index: number, message: WhatsappMessage): string {
    return message.uuid;
  }

  private resizeOberserver(callback: Function): ResizeObserver {
    return new ResizeObserver((entries) => {
      callback();
    });
  }

  private scrollToBottom() {
    const resizeObserver = this.resizeOberserver(() => {
      const { nativeElement } = this.scroller!;
      const { scrollHeight: top } = nativeElement;
      nativeElement.scrollTo({ top });
    });
    resizeObserver.observe(this.messageContainer!.nativeElement);
  }
}
