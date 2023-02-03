import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { WhatsappMessageQueryDto } from '@whatsapp/interface';
import { Apollo } from 'apollo-angular';
import { filter, map, Observable, skip, takeUntil } from 'rxjs';
import {
  StatusUpdateSubResult,
  StatusUpdateSubVariables,
  READ_UPDATE_SUBSCRIPTION,
} from './read-update.graphql';

@Injectable({
  providedIn: 'root',
})
export class ReadUpdateSubscriptionService {
  private takeUntilCondition = this.store
    .select(({ authentication }) => authentication.whatsappUser)
    .pipe(skip(1));

  constructor(private apollo: Apollo, private store: Store) {}

  readStatusUpdateSubscription(
    id: number
  ): Observable<WhatsappMessageQueryDto> {
    const subQueryOptions = {
      query: READ_UPDATE_SUBSCRIPTION,
      variables: { id },
    };

    return this.apollo
      .subscribe<StatusUpdateSubResult, StatusUpdateSubVariables>(
        subQueryOptions
      )
      .pipe(
        takeUntil(this.takeUntilCondition),
        filter(({ data }) => Boolean(data)),
        map(({ data }) => data!.messageStatusSubscription)
      );
  }
}
