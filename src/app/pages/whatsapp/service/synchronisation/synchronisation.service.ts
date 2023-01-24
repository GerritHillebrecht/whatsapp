import { Injectable } from '@angular/core';
import { WatchQueryFetchPolicy } from '@apollo/client/core';
import { AuthenticationState } from '@auth/store';
import { Store } from '@ngxs/store';
import { WhatsappStateModel as WSM } from '@whatsapp/store';
import {
  AddMessage,
  AddMessages,
  UpdateContacts,
  UpdateReadStatus,
} from '@whatsapp/store/whatsapp.actions';
import { Apollo } from 'apollo-angular';
import { filter, Observable, skip, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappUser,
  WhatsappMessageQueryDto,
} from '../../interface';
import {
  StatusUpdateSubResult,
  StatusUpdateSubVariables,
  STATUS_UPDATE_SUBSCRIPTION,
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
  takeUntilCondition = this.store
    .select(({ authentication }) => authentication.whatsappUser)
    .pipe(skip(1));

  constructor(private apollo: Apollo, private store: Store) {}

  syncDataWithServer(id: number): Observable<{
    contacts: WhatsappContact[];
    messageMap: Map<number, WhatsappMessage[]>;
  }> {
    const syncQueryOptions = {
      query: SYNCHRONIZATION_QUERY,
      variables: { id },
      fetchPolicy: 'cache-and-network' as WatchQueryFetchPolicy,
    };

    return this.apollo
      .watchQuery<SyncQueryResult, SyncQueryVariables>(syncQueryOptions)
      .valueChanges.pipe(
        takeUntil(this.takeUntilCondition),
        filter((result) => Boolean(result.data)),
        map(({ data: { messages, contacts } }) => {
          const messageMap = this.processMessages(messages, contacts);
          const contactsData = this.processContacts(messageMap, contacts);
          return { contacts: contactsData, messageMap };
        })
      );
  }

  private processMessages(
    messages: WhatsappMessageQueryDto[],
    contacts: WhatsappUser[]
  ): Map<number, WhatsappMessage[]> {
    return contacts.reduce((messageMap, { id }) => {
      const contactMessages = this.filterAndMapMessages(messages, id);
      messageMap.set(id, contactMessages);
      return messageMap;
    }, new Map());
  }

  private processContacts(
    messages: Map<number, WhatsappMessage[]>,
    contacts: WhatsappUser[]
  ): WhatsappContact[] {
    return contacts.map((contact) => {
      const contactMessages = messages.get(contact.id) || [];
      const lastMessage = contactMessages.at(0) || null;
      const unreadMessages = contactMessages.filter(
        (message) =>
          message.sender.id === contact.id &&
          message.deliveryStatus === 'delivered'
      ).length;

      return {
        ...contact,
        messages: contactMessages,
        lastMessage,
        unreadMessages,
      };
    });
  }

  messageSubscription(
    id: number
  ): Observable<{ contacts: WhatsappContact[]; message: WhatsappMessage }> {
    const subQueryOptions = {
      query: SUBSCRIPTION_QUERY,
      variables: { id },
    };

    return this.apollo
      .subscribe<SubQueryResult, SubQueryVariables>(subQueryOptions)
      .pipe(
        takeUntil(
          this.store
            .select(({ authentication }) => authentication.whatsappUser)
            .pipe(skip(1))
        ),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => {
          const message = this.mapDtoToMessage(data!.messageSubscription);
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
            this.store.dispatch(new UpdateReadStatus([message]));
          }

          return {
            contacts: this.addMessageToContact(data!.messageSubscription, id),
            message,
          };
        })
      );
  }

  messageStatusUpdateSubscription(
    id: number
  ): Observable<WhatsappMessageQueryDto> {
    const subQueryOptions = {
      query: STATUS_UPDATE_SUBSCRIPTION,
      variables: { id },
    };

    return this.apollo
      .subscribe<StatusUpdateSubResult, StatusUpdateSubVariables>(
        subQueryOptions
      )
      .pipe(
        takeUntil(
          this.store
            .select(({ authentication }) => authentication.whatsappUser)
            .pipe(skip(1))
        ),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => data!.messageStatusSubscription)
      );
  }

  // Hepler Functions //////////////////////////////////////////////////////////

  private updateContactsAndMessages(
    messages: WhatsappMessageQueryDto[],
    contacts: WhatsappContact[]
  ) {
    const messageMap = this.createMessageMap(contacts, messages);

    const contactsData: WhatsappContact[] = contacts.map((contact) => {
      const contactMessages = messages
        .filter(({ sender, receiver }) =>
          [sender.id, receiver.id].includes(contact.id)
        )
        .map((message) => this.mapDtoToMessage(message));
      messageMap.set(contact.id, contactMessages);

      return {
        ...contact,
        messages: contactMessages,
        lastMessage: contactMessages[contactMessages.length - 1],
        unreadMessages: 0,
      };
    });
    this.store.dispatch(new AddMessages(messageMap));
    this.store.dispatch(new UpdateContacts(contactsData));
  }

  private createMessageMap(
    contacts: WhatsappContact[],
    messages: WhatsappMessageQueryDto[]
  ) {
    return contacts.reduce(
      (acc, { id }) => acc.set(id, this.filterAndMapMessages(messages, id)),
      new Map()
    );
  }

  private filterAndMapMessages(
    messages: WhatsappMessageQueryDto[],
    contactId: number
  ) {
    return messages
      .filter(({ sender, receiver }) =>
        [sender.id, receiver.id].includes(contactId)
      )
      .map((message) => this.mapDtoToMessage(message));
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
        (message) => this.mapDtoToMessage(message)
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

  private mapDtoToMessage(message: WhatsappMessageQueryDto): WhatsappMessage {
    const id = this.store.snapshot().authentication.whatsappUser?.id;
    console.log('MAPPING DTO FFS', { id });
    return {
      ...message,
      isMine: id === message.sender.id,
      createdAt: new Date(new Date(message.createdAt).getTime() - 1000),
    };
  }
}
