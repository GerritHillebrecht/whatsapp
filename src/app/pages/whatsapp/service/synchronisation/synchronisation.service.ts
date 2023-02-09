import { Injectable } from '@angular/core';
import { AuthenticationState } from '@auth/store';
import { NotificationService } from '@core/services/notification';
import { Store } from '@ngxs/store';
import { WhatsappContactState } from '@whatsapp/store';
import { UpdateReadStatus } from '@whatsapp/store/message/message.actions';
import { Apollo } from 'apollo-angular';
import {
  catchError,
  delay,
  Observable,
  retryWhen,
  skip,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { map } from 'rxjs';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappUser,
} from '../../interface';
import { MessageHelperService } from '../message/message-helper.service';
import {
  ContactQueryResult,
  ContactQueryVariables,
  CONTACT_QUERY,
  MessageQueryResult,
  MessageQueryVariables,
  MESSAGE_QUERY,
} from './sync.query';

export interface MessageMap {
  [key: WhatsappContact['id']]: WhatsappMessage[];
}

@Injectable({
  providedIn: 'root',
})
export class SynchronisationService {
  private retryCount = 1;

  private takeUntilCondition = this.store
    .select(AuthenticationState.firebaseUser)
    .pipe(skip(1));

  private errorHandler = (error: any) => {
    this.notification.serverConnectionError(this.retryCount++);
    return throwError(() => new Error('Error while fetching data'));
  };

  private retryWhenCondition = (errors: Observable<Error>) =>
    errors.pipe(delay(5000), take(5));

  constructor(
    private store: Store,
    private apollo: Apollo,
    private support: MessageHelperService,
    private notification: NotificationService
  ) {}

  fetchMessages(whatsAppUserId: number): Observable<WhatsappMessage[]> {
    return this.apollo
      .watchQuery<MessageQueryResult, MessageQueryVariables>({
        query: MESSAGE_QUERY,
        variables: { id: whatsAppUserId },
      })
      .valueChanges.pipe(
        takeUntil(this.takeUntilCondition),
        catchError(this.errorHandler),
        retryWhen(this.retryWhenCondition),
        map(({ data }) => data.messages || []),
        map((messages) => messages.map((msg) => this.support.mapToMsg(msg))),
        tap((messages) => this.markAsRead(messages))
      );
  }

  fetchContacts(whatsAppUserId: number): Observable<WhatsappUser[]> {
    return this.apollo
      .watchQuery<ContactQueryResult, ContactQueryVariables>({
        query: CONTACT_QUERY,
        variables: { id: whatsAppUserId },
      })
      .valueChanges.pipe(
        takeUntil(this.takeUntilCondition),
        catchError(this.errorHandler),
        retryWhen(this.retryWhenCondition),
        map(({ data }) => data.contacts || [])
      );
  }

  private markAsRead(messages: WhatsappMessage[]): void {
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

    console.log('unreadMessageIds', unreadMessageIds);

    if (unreadMessageIds.length > 0) {
      this.store.dispatch(new UpdateReadStatus(unreadMessageIds));
    }
  }
}
