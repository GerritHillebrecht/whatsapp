import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComposeService, MessageService } from '@whatsapp/service';
import { TextareaComponent, EmojiSelectorComponent } from './input';
import { ImageSelectorComponent } from './input/image-selector/image-selector.component';
import { Select, Store } from '@ngxs/store';
import { SendMessage } from '@whatsapp/store/message/message.actions';
import { MessageHelperService } from '@whatsapp/service/message/message-helper.service';
import { WhatsappContactState } from '@whatsapp/store';
import { distinctUntilChanged, Observable } from 'rxjs';
import { WhatsappContact } from '@whatsapp/interface';

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,

    TextareaComponent,
    EmojiSelectorComponent,
    ImageSelectorComponent,

    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss'],
})
export class MessageComposerComponent implements OnInit {
  @Select(WhatsappContactState.selectedContact)
  selectedContact$: Observable<WhatsappContact> | undefined;

  constructor(
    protected helper: MessageHelperService,
    protected compose: MessageComposeService,
    protected message: MessageService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.selectedContact$?.pipe(distinctUntilChanged()).subscribe(() => {
      this.compose.messageForm.reset({ text: '', image: '' });
      this.helper.showImageSelector$.next(false);
    });
  }

  toggleImageSelector() {
    this.helper.showImageSelector$.next(!this.helper.showImageSelector$.value);
  }

  sendMessage() {
    this.store.dispatch(new SendMessage());
  }
}
