import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComposeService, MessageService } from '@whatsapp/service';
import { TextareaComponent, EmojiSelectorComponent } from './input';

@Component({
  selector: 'app-message-composer',
  standalone: true,
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,

    TextareaComponent,
    EmojiSelectorComponent,

    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './message-composer.component.html',
  styleUrls: ['./message-composer.component.scss'],
})
export class MessageComposerComponent {
  constructor(
    protected compose: MessageComposeService,
    protected message: MessageService
  ) {}

  sendMessage() {
    this.message.sendMessage().subscribe();
  }
}
