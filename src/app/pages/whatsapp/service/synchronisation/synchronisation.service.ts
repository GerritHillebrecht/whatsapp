import { Injectable } from '@angular/core';
import { WatchQueryFetchPolicy } from '@apollo/client/core';
import { NotificationService } from '@core/services/notification';
import { Store } from '@ngxs/store';
import { Apollo } from 'apollo-angular';
import {
  catchError,
  delay,
  filter,
  interval,
  Observable,
  retryWhen,
  skip,
  take,
  takeUntil,
  tap,
  timeout,
} from 'rxjs';
import { map } from 'rxjs';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappUser,
  WhatsappMessageQueryDto,
} from '../../interface';
import { MessageHelperService } from '../message/message-helper.service';
import {
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
    private helper: MessageHelperService,
    private notification: NotificationService
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
        catchError(() => {
          this.notification.notification$.next(
            'Daten konnten nicht geladen werden, erneuter Versuch in 5 Sekunden'
          );
          throw new Error('Error while fetching data');
        }),
        retryWhen((errors) => errors.pipe(delay(5000), take(5))),
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
