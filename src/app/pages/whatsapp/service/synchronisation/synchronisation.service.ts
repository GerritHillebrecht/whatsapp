import { Injectable } from '@angular/core';
import { WatchQueryFetchPolicy } from '@apollo/client/core';
import { AuthenticationStateModel as ASM } from '@auth/store';
import { Store } from '@ngxs/store';
import { WhatsappStateModel as WSM } from '@whatsapp/store';
import { Apollo } from 'apollo-angular';
import { filter, Observable, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappUser,
  WhatsappMessageQueryDto,
} from '../../interface';
import {
  MARK_MESSAGES_AS_READ_MUTATION,
  SubQueryResult,
  SubQueryVariables,
  SUBSCRIPTION_QUERY,
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
        takeUntil(
          this.store.select(({ authentication }) => authentication.user)
        ),
        filter((result) => Boolean(result.data)),
        map(({ data: { messages, contacts } }) => {
          // this.markMessagesAsRead(messages);
          return this.mapMessagesToContacts(messages, contacts);
        })
      );
  }

  messageSubscription(id: number): Observable<WhatsappContact[]> {
    console.log('SUBSCRIPTION STARTED');
    console.log({ store: this.store.snapshot().authentication });
    const subQueryOptions = {
      query: SUBSCRIPTION_QUERY,
      variables: {
        id: this.store.snapshot().authentication.user.id,
      },
    };

    return this.apollo
      .subscribe<SubQueryResult, SubQueryVariables>(subQueryOptions)
      .pipe(
        takeUntil(
          this.store.select(({ authentication }) => authentication.user)
        ),
        filter(({ data }) => Boolean(data)),
        map(({ data }) =>
          this.addMessageToContact(data!.messageSubscription, id)
        )
      );
  }

  private addMessageToContact(
    msgData: WhatsappMessageQueryDto,
    id: number
  ): WhatsappContact[] {
    const { contacts }: WSM = this.store.snapshot().whatsapp;
    const { sender, receiver } = msgData;

    const isMine = sender.id === id;
    const message: WhatsappMessage = { ...msgData, isMine };

    const contact =
      contacts.find((c) => c.id === (isMine ? receiver.id : sender.id)) ||
      this.temporaryNewContact(sender, message);

    const updatedContact = this.updateContact(contact, message);

    return contacts
      .filter((c) => c.id !== updatedContact.id)
      .concat([updatedContact])
      .sort((a, b) => {
        if (!a.lastMessage || !b.lastMessage) return -1;
        return (
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
        );
      });
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

  private updateContact(
    contact: WhatsappContact,
    message: WhatsappMessage
  ): WhatsappContact {
    const { selectedContact }: WSM = this.store.snapshot().whatsapp;
    const updateCount = Number(
      selectedContact?.id !== contact.id || !message.isMine
    );

    return {
      ...contact,
      lastMessage: message,
      messages: [message, ...contact.messages],
      unreadMessages: contact.unreadMessages + updateCount,
    };
  }

  private temporaryNewContact(
    user: WhatsappUser,
    message: WhatsappMessage
  ): WhatsappContact {
    return {
      ...user,
      lastMessage: null,
      messages: [],
      unreadMessages: 0,
    };
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
