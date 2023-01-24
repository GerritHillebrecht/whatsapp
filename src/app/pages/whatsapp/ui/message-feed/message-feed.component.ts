import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message';
import { Select, Store } from '@ngxs/store';
import { WhatsappState } from '@pages/whatsapp/store';
import { Observable } from 'rxjs';
import { WhatsappMessage } from '@pages/whatsapp/interface';
import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MessageComposerComponent } from '../message-composer';
import { ContactInfoBarComponent } from '../contact-info-bar';
import { ScreenSizeService } from '@core/services/screen-size';

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
export class MessageFeedComponent implements OnInit, AfterViewInit {
  @ViewChild('scroller')
  scroller: ElementRef<HTMLDivElement> | undefined;

  @ViewChild('messageContainer')
  messageContainer: ElementRef<HTMLDivElement> | undefined;

  messages$: Observable<WhatsappMessage[] | null> | undefined;

  constructor(
    protected screenSizeService: ScreenSizeService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.messages$ = this.store.select(WhatsappState.messages(0, 100));
  }

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
