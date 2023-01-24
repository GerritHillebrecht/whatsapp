import { Injectable } from '@angular/core';
import { WatchQueryFetchPolicy } from '@apollo/client/core';
import { AuthenticationState, AuthenticationStateModel } from '@auth/store';
import { Store } from '@ngxs/store';
import {
  WhatsappState,
  WhatsappStateModel,
  WhatsappStateModel as WSM,
} from '@whatsapp/store';
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
import { MessageHelperService } from '../message/message-helper.service';
import {
  StatusUpdateSubResult,
  StatusUpdateSubVariables,
  STATUS_UPDATE_SUBSCRIPTION,
  SubQueryResult,
  SubQueryVariables,
  MESSAGE_SUBSCRIPTION,
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

  constructor(
    private apollo: Apollo,
    private store: Store,
    private helper: MessageHelperService
  ) {}

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
          this.helper.markAsRead(
            Array.from(messageMap, ([key, value]) => value).flat() || []
          );
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

  private filterAndMapMessages(
    messages: WhatsappMessageQueryDto[],
    contactId: number
  ) {
    return messages
      .filter(({ sender, receiver }) =>
        [sender.id, receiver.id].includes(contactId)
      )
      .map((message) => this.helper.mapDtoToMessage(message));
  }
}
