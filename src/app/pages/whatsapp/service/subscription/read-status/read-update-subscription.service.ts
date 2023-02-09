import { Injectable } from '@angular/core';
import { AuthenticationState } from '@auth/store';
import { Store } from '@ngxs/store';
import { WhatsappMessageQueryDto as WMQDto } from '@whatsapp/interface';
import {
  MessageQueryResult,
  MESSAGE_QUERY,
} from '@whatsapp/service/synchronisation/sync.query';
import { Apollo } from 'apollo-angular';
import { filter, map, Observable, skip, takeUntil, tap } from 'rxjs';
import {
  StatusUpdateSubResult,
  StatusUpdateSubVariables,
  READ_UPDATE_SUBSCRIPTION,
} from './read-update.graphql';

@Injectable({
  providedIn: 'root',
})
export class ReadUpdateSubscriptionService {
  constructor(private apollo: Apollo, private store: Store) {}

  readStatusUpdateSubscription(id: number): Observable<WMQDto[]> {
    const subQueryOptions = {
      query: READ_UPDATE_SUBSCRIPTION,
      variables: { id },
    };

    const takeUntilCondition = this.store
      .select(AuthenticationState.firebaseUser)
      .pipe(skip(1));

    console.log(
      '%c read status update subscription',
      'font-size: 40px; font-weight: bold',
      { id }
    );

    return this.apollo
      .subscribe<StatusUpdateSubResult, StatusUpdateSubVariables>(
        subQueryOptions
      )
      .pipe(
        takeUntil(takeUntilCondition),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => data!.readupdateSubscription),
        tap((readMessages) => {
          console.log(
            '%cread status update ',
            'color: purple; font-size: 35px',
            readMessages
          );
          const cacheQueryOptions = {
            query: MESSAGE_QUERY,
            variables: { id },
          };

          this.apollo.client.cache.updateQuery(
            cacheQueryOptions,
            (data: MessageQueryResult | null) => {
              if (!data) return;
              if (!data.messages) return;

              const msgIds = readMessages.map((readMsg) => readMsg.id);
              const storedMessages: WMQDto[] = [...data.messages].map((msg) => {
                if (msgIds.includes(msg.id)) {
                  return { ...msg, deliveryStatus: 'read' };
                }
                return msg;
              });

              return {
                ...data,
                messages: storedMessages,
              };
            }
          );
        })
      );
  }
}
