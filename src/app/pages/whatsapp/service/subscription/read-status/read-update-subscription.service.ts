import { inject, Injectable } from '@angular/core';
import { AuthenticationState } from '@auth/store';
import { Store } from '@ngxs/store';
import { WhatsappMessageQueryDto as WMQDto } from '@whatsapp/interface';
import {
  MessageQueryResult as MQR,
  MessageQueryVariables as MQV,
  MESSAGE_QUERY,
} from '@whatsapp/service/synchronisation/sync.query';
import { QUERY_LIMIT } from '@whatsapp/tokens';
import { Apollo, TypedDocumentNode } from 'apollo-angular';
import { filter, map, Observable, skip, takeUntil, tap } from 'rxjs';
import {
  StatusUpdateSubResult,
  StatusUpdateSubVariables,
  READ_UPDATE_SUBSCRIPTION,
} from './read-update.graphql';

export interface CacheMessageQueryOptions {
  query: TypedDocumentNode<MQR, MQV>;
  variables: MQV;
}

@Injectable({
  providedIn: 'root',
})
export class ReadUpdateSubscriptionService {
  limit = inject(QUERY_LIMIT);

  constructor(private apollo: Apollo, private store: Store) {}

  readStatusUpdateSubscription(id: number): Observable<WMQDto[]> {
    const subQueryOptions = {
      query: READ_UPDATE_SUBSCRIPTION,
      variables: { id },
    };

    const takeUntilCondition = this.store
      .select(AuthenticationState.firebaseUser)
      .pipe(skip(1));

    return this.apollo
      .subscribe<StatusUpdateSubResult, StatusUpdateSubVariables>(
        subQueryOptions
      )
      .pipe(
        takeUntil(takeUntilCondition),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => data!.readupdateSubscription),
        tap((readMessages) => {
          const cacheQueryOptions: CacheMessageQueryOptions = {
            query: MESSAGE_QUERY,
            variables: { id, limit: this.limit },
          };

          this.apollo.client.cache.updateQuery<MQR, MQV>(
            cacheQueryOptions,
            (data: MQR | null) => {
              if (!data) return;
              if (!data.messages) return;

              const msgIds = readMessages.map((readMsg) => readMsg.id);
              const messages: WMQDto[] = [...data.messages].map((msg) => {
                if (msgIds.includes(msg.id)) {
                  return { ...msg, deliveryStatus: 'read' };
                }
                return msg;
              });

              return {
                ...data,
                messages,
              };
            }
          );
        })
      );
  }
}
