import { Injectable } from '@angular/core';
import { WatchQueryFetchPolicy } from '@apollo/client/core';
import { Store } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappUser,
  WhatsappMessageQueryDto,
} from '../../interface';
import {
  MARK_MESSAGES_AS_READ_MUTATION,
  SYNCHRONIZATION_QUERY,
  SyncQueryResult,
  SyncQueryVariables,
} from './sync.query';

@Injectable({
  providedIn: 'root',
})
export class SynchronisationService {
  constructor(private apollo: Apollo, private store: Store) {}

  syncDataWithServer(id: number): Observable<WhatsappContact[]> {
    const syncQueryOptions = {
      query: SYNCHRONIZATION_QUERY,
      variables: { id },
      fetchPolicy: 'cache-and-network' as WatchQueryFetchPolicy,
    };

    return this.apollo
      .watchQuery<SyncQueryResult, SyncQueryVariables>(syncQueryOptions)
      .valueChanges.pipe(
        map(({ data: { messages, contacts } }) => {
          // this.markMessagesAsRead(messages);
          return this.mapMessagesToContacts(messages, contacts);
        })
      );
  }

  private markMessagesAsRead(messages: WhatsappMessageQueryDto[]) {
    const selectedChat = this.store.snapshot().whatsapp.selectedChat;
    const unreadMessages = messages
      .filter(
        (message) =>
          message.deliveryStatus !== 'read' &&
          message.sender.id === selectedChat.id
      )
      .map((message) => message.id);

    // this.apollo.mutate({
    //   mutation: MARK_MESSAGES_AS_READ_MUTATION,
    //   variables: { messageIds: unreadMessages },
    // });
  }

  private mapMessagesToContacts(
    messages: WhatsappMessageQueryDto[],
    contacts: WhatsappUser[]
  ): WhatsappContact[] {
    return contacts.map((contact) => {
      const filteredMessages = this.filterMessages(messages, contact).map(
        (message) => this.mapMessage(message)
      );

      const unreadMessages = filteredMessages.filter(
        (message) => !message.isRead && !message.isMine
      ).length;

      const lastMessage = filteredMessages[0];

      return {
        ...contact,
        image: contact.image || `https://i.pravatar.cc/300?img=${contact.id}`,
        messages: filteredMessages,
        lastMessage,
        unreadMessages,
      };
    });
  }

  private filterMessages(
    messages: WhatsappMessageQueryDto[],
    contact: WhatsappUser
  ) {
    return messages.filter(({ sender, receiver }) =>
      [sender.id, receiver.id].includes(contact.id)
    );
  }

  private mapMessage(message: WhatsappMessageQueryDto): WhatsappMessage {
    const id = this.store.snapshot().authentication.user.id;
    return {
      ...message,
      isMine: id === message.sender.id,
      createdAt: new Date(new Date(message.createdAt).getTime() - 1000),
    };
  }
}
