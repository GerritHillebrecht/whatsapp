import { Injectable } from '@angular/core';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/de';
import dayjs from 'dayjs';
import { Store } from '@ngxs/store';
import { WhatsappMessage, WhatsappMessageQueryDto } from '@whatsapp/interface';
import { WhatsappContactState, WhatsappState } from '@whatsapp/store';
import { UpdateReadStatus } from '@whatsapp/store/whatsapp.actions';
import { BehaviorSubject } from 'rxjs';
dayjs.extend(relativeTime);
dayjs.locale('de');

@Injectable({
  providedIn: 'root',
})
export class MessageHelperService {
  showImageSelector$ = new BehaviorSubject<boolean>(false);

  constructor(private store: Store) {}

  mapToMsg(message: WhatsappMessageQueryDto): WhatsappMessage {
    const currentUserId = this.store.selectSnapshot(
      WhatsappState.whatsappUser
    )?.id;

    return {
      ...message,
      isMine: currentUserId === message.sender.id,
      createdAt: new Date(new Date(message.createdAt).getTime() - 1000),
    };
  }

  markAsRead(messages: WhatsappMessage[]): void {
    const selectedUserId = this.store.selectSnapshot(
      WhatsappContactState.selectedContact
    )?.id;

    if (!selectedUserId) return;

    const unreadMessageIds = messages
      .filter(({ sender, deliveryStatus, isMine }) => {
        return (
          !isMine &&
          sender.id === selectedUserId &&
          deliveryStatus === 'delivered'
        );
      })
      .map(({ id }) => id);

    if (unreadMessageIds.length > 0) {
      this.store.dispatch(new UpdateReadStatus(unreadMessageIds));
    }
  }

  fromNow(date: Date) {
    return dayjs(date).fromNow();
  }
}
