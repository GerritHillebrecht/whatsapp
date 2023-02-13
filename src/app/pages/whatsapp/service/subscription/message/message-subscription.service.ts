import { inject, Injectable } from '@angular/core';
import {
  AuthenticationState,
  AuthenticationState as AuthState,
} from '@auth/store';

import { Store } from '@ngxs/store';
import { WhatsappMessage, WhatsappMessageQueryDto } from '@whatsapp/interface';
import {
  MessageQueryResult as MQR,
  MessageQueryVariables as MQV,
  MESSAGE_QUERY,
  SyncQueryResult as SyncResult,
  SyncQueryVariables as SyncVars,
} from '@whatsapp/service/synchronisation/sync.query';
import { QUERY_LIMIT } from '@whatsapp/tokens';
import { Apollo } from 'apollo-angular';
import { filter, map, Observable, skip, takeUntil, tap } from 'rxjs';
import { MessageHelperService } from '../../message/message-helper.service';
import { CacheMessageQueryOptions } from '../read-status/read-update-subscription.service';
import {
  MESSAGE_SUBSCRIPTION,
  SubQueryResult,
  SubQueryVariables,
} from './message.subscription.graphql';

@Injectable({
  providedIn: 'root',
})
export class MessageSubscriptionService {
  limit = inject(QUERY_LIMIT);
  mapDtoToMessage: (dto: WhatsappMessageQueryDto) => WhatsappMessage;

  constructor(
    private apollo: Apollo,
    private store: Store,
    private helper: MessageHelperService
  ) {
    this.mapDtoToMessage = this.helper.mapToMsg.bind(this.helper);
  }

  messageSubscription(id: number): Observable<WhatsappMessage> {
    const subQueryOptions = {
      query: MESSAGE_SUBSCRIPTION,
      variables: { id },
    };

    const takeUntilCondition = this.store
      .select(AuthenticationState.firebaseUser)
      .pipe(skip(1));

    return this.apollo
      .subscribe<SubQueryResult, SubQueryVariables>(subQueryOptions)
      .pipe(
        tap((data) =>
          console.log('%cmessage update', 'font-size:40px; color: red', data)
        ),
        takeUntil(takeUntilCondition),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => data!.messageSubscription),
        map((dto) => this.mapDtoToMessage(dto)),
        tap((message) => {
          const cacheQueryOptions: CacheMessageQueryOptions = {
            query: MESSAGE_QUERY,
            variables: { id, limit: this.limit },
          };

          this.apollo.client.cache.updateQuery<MQR, MQV>(
            cacheQueryOptions,
            (data: MQR | null) => {
              if (!data) return;
              if (data.messages.some((m) => m.uuid === message.uuid)) return;

              return {
                ...data,
                messages: [message, ...(data.messages || [])],
              };
            }
          );
        })
      );
  }
}
