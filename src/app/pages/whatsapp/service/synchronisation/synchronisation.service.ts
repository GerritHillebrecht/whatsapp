import { inject, Injectable } from '@angular/core';
import { AuthenticationState } from '@auth/store';
import { NotificationService } from '@core/services/notification';
import { Store } from '@ngxs/store';
import { QUERY_LIMIT } from '@whatsapp/tokens';
import { Apollo } from 'apollo-angular';
import {
  catchError,
  delay,
  from,
  Observable,
  retryWhen,
  skip,
  switchMap,
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
  private limit = inject(QUERY_LIMIT);

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

  fetchMessages(
    whatsAppUserId: number,
    offset = 0
  ): Observable<WhatsappMessage[]> {
    return this.apollo
      .watchQuery<MessageQueryResult, MessageQueryVariables>({
        query: MESSAGE_QUERY,
        variables: { id: whatsAppUserId, limit: this.limit },
      })
      .valueChanges.pipe(
        takeUntil(this.takeUntilCondition),
        catchError(this.errorHandler),
        retryWhen(this.retryWhenCondition),
        map(({ data }) => data.messages || []),
        map((messages) => messages.map((msg) => this.support.mapToMsg(msg)))
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
}
function switchMmap(
  arg0: (messages: any) => any
): import('rxjs').OperatorFunction<
  import('../../interface').WhatsappMessageQueryDto[],
  WhatsappMessage[]
> {
  throw new Error('Function not implemented.');
}
