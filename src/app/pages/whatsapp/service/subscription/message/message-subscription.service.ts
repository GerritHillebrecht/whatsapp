import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappMessageQueryDto,
} from '@whatsapp/interface';
import { WhatsappState, WhatsappStateModel as WSM } from '@whatsapp/store';
import { UpdateReadStatus } from '@whatsapp/store/whatsapp.actions';
import { Apollo } from 'apollo-angular';
import { filter, map, Observable, skip, takeUntil } from 'rxjs';
import { MessageHelperService } from '../../message/message-helper.service';
import {
  MESSAGE_SUBSCRIPTION,
  SubQueryResult,
  SubQueryVariables,
} from './message.subscription.graphql';

@Injectable({
  providedIn: 'root',
})
export class MessageSubscriptionService {
  takeUntilCondition = this.store
    .select(({ authentication }) => authentication.whatsappUser)
    .pipe(skip(1));

  mapDtoToMessage: (dto: WhatsappMessageQueryDto) => WhatsappMessage;

  constructor(
    private apollo: Apollo,
    private store: Store,
    private helper: MessageHelperService
  ) {
    this.mapDtoToMessage = this.helper.mapDtoToMessage.bind(this.helper);
  }

  messageSubscription(id: number): Observable<{
    contacts: WhatsappContact[];
    message: WhatsappMessage;
  }> {
    const subQueryOptions = {
      query: MESSAGE_SUBSCRIPTION,
      variables: { id },
    };

    return this.apollo
      .subscribe<SubQueryResult, SubQueryVariables>(subQueryOptions)
      .pipe(
        takeUntil(this.takeUntilCondition),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => {
          const message = this.mapDtoToMessage(data!.messageSubscription);
          const contacts = this.updateContact(message);

          return { contacts, message };
        })
      );
  }

  private updateContact(message: WhatsappMessage): WhatsappContact[] {
    const { sender, receiver, isMine } = message;
    const { contacts }: WSM = this.store.selectSnapshot(WhatsappState);

    const contactIndex = contacts.findIndex(
      (contact) => contact.id === (isMine ? receiver.id : sender.id)
    );

    contacts[contactIndex].lastMessage = message;
    contacts[contactIndex].unreadMessages += isMine ? 0 : 1;
    contacts[contactIndex].messages.unshift(message);

    this.markMessageAsRead(message);

    return contacts;
  }

  private markMessageAsRead(message: WhatsappMessage): void {
    const currentUserId = this.store.selectSnapshot(
      ({ authentication }) => authentication.whatsappUser?.id
    );
    const selectedUserId = this.store.selectSnapshot(
      ({ whatsapp }) => whatsapp.selectedContact?.id
    );
    const contactId =
      message.sender.id === currentUserId
        ? message.receiver.id
        : message.sender.id;

    if (contactId === selectedUserId) {
      this.store.dispatch(new UpdateReadStatus([message.id]));
    }
  }
}
