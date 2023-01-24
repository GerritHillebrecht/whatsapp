import { Injectable } from '@angular/core';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import { Store } from '@ngxs/store';
import { WhatsappMessage, WhatsappMessageQueryDto } from '@whatsapp/interface';
import { AuthenticationState } from '@auth/store';
import { WhatsappState } from '@whatsapp/store';
import { UpdateReadStatus } from '@whatsapp/store/whatsapp.actions';
dayjs.extend(relativeTime);
dayjs.locale('de');

@Injectable({
  providedIn: 'root',
})
export class MessageHelperService {
  constructor(private store: Store) {}

  mapDtoToMessage(message: WhatsappMessageQueryDto): WhatsappMessage {
    const currentUserId = this.store.snapshot().authentication.whatsappUser?.id;

    return {
      ...message,
      isMine: currentUserId === message.sender.id,
      createdAt: new Date(new Date(message.createdAt).getTime() - 1000),
    };
  }

  markAsRead(messages: WhatsappMessage[]): void {
    const { selectedContact } = this.store.selectSnapshot(WhatsappState);
    const unreadMessages = messages.filter((message) => {
      const { sender, receiver, deliveryStatus, isMine } = message;
      return (
        !isMine &&
        deliveryStatus === 'delivered' &&
        [sender.id, receiver.id].includes(selectedContact.id)
      );
    });
    const messageIds = unreadMessages.map((message) => message.id);

    this.store.dispatch(new UpdateReadStatus(messageIds));
  }

  fromNow(date: Date) {
    return dayjs(date).fromNow();
  }
}
