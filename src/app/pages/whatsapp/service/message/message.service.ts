import { inject, Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { map, take } from 'rxjs';
import { WhatsappUser } from '@whatsapp/interface';
import { MessageComposeService } from '../message-compose/message-compose.service';
import { Store } from '@ngxs/store';
import uniqid from 'uniqid';

import {
  MessageQueryResult,
  MessageQueryVariables,
  MESSAGE_QUERY,
  SyncQueryResult as syncResult,
  SyncQueryVariables as syncVars,
} from '../synchronisation/sync.query';
import {
  MessageCreateResult,
  MessageCreateVariables,
  MESSAGE_CREATE_MUTATION,
} from '@pages/test-bench/personal-testing/graphql-optimistic-response/typedDocumentNodes.graphql';

import {
  ReadStatusUpdateResult,
  ReadStatusUpdateVariables,
  READ_STATUS_UPDATE_MUTATION,
} from './message.graphql';
import { WhatsappContactState, WhatsappState } from '@whatsapp/store';
import { ApolloCache } from '@apollo/client/core';
import { CacheMessageQueryOptions } from '../subscription/read-status/read-update-subscription.service';
import { QUERY_LIMIT } from '@whatsapp/tokens';
import { StorageService } from '../storage';
import { MessageHelperService } from './message-helper.service';

interface OptimisticResponseVariables {
  uuid: string;
  body: string;
  sender: WhatsappUser;
  image: string | null;
  receiver: WhatsappUser;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  limit = inject(QUERY_LIMIT);

  constructor(
    private apollo: Apollo,
    private store: Store,
    private storage: StorageService,
    private compose: MessageComposeService,
    private helper: MessageHelperService
  ) {}

  async sendMessage() {
    const [sender, receiver] = [
      this.store.selectSnapshot(WhatsappState.whatsappUser)!,
      this.store.selectSnapshot(WhatsappContactState.selectedContact)!,
    ];

    const uuid = uniqid();
    const body = this.compose.messageControl.value;
    const image =
      this.compose.imageControl.value && !sender.isBot
        ? await this.storage.uploadImage(this.compose.imageControl.value, uuid)
        : '';

    const variables: MessageCreateVariables = {
      uuid,
      body,
      image,
      receiverId: receiver.id,
      senderId: sender.id,
    };

    const optimisticResponse: MessageCreateResult =
      this.createOptimisticResponse({
        uuid,
        body,
        sender,
        image,
        receiver,
      });

    return this.apollo
      .mutate<MessageCreateResult, MessageCreateVariables>({
        mutation: MESSAGE_CREATE_MUTATION,
        variables,
        optimisticResponse,
        update: (cache, { data }) => {
          if (!data) return;

          const { id } = this.store.selectSnapshot(WhatsappState.whatsappUser)!;
          const { saveMessage: message } = data;

          const cacheQueryOptions: CacheMessageQueryOptions = {
            query: MESSAGE_QUERY,
            variables: { id, limit: this.limit },
          };

          cache.updateQuery<MessageQueryResult, MessageQueryVariables>(
            cacheQueryOptions,
            (data: MessageQueryResult | null): MessageQueryResult | null => {
              if (!data) {
                return data;
              }
              if (data.messages.some((m) => m.uuid === message.uuid)) {
                return data;
              }

              return {
                ...data,
                messages: [message, ...(data!.messages || [])],
              };
            }
          );
          this.compose.messageForm.reset({ text: '', image: '' });
          this.helper.showImageSelector$.next(false);
        },
      })
      .pipe(
        map((result: any) => result.data.sendMessage),
        take(1)
      );
  }

  private createOptimisticResponse({
    uuid,
    body,
    sender,
    image,
    receiver,
  }: OptimisticResponseVariables): MessageCreateResult {
    return {
      __typename: 'Mutation',
      saveMessage: {
        __typename: 'Message',
        id: 0,
        uuid: uuid,
        body,
        image,
        deliveryStatus: 'pending',
        sender: {
          __typename: 'User',
          ...sender,
        },
        receiver: {
          __typename: 'User',
          ...receiver,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }

  updateReadStatus(messageIds: number[]) {
    return this.apollo
      .mutate<ReadStatusUpdateResult, ReadStatusUpdateVariables>({
        mutation: READ_STATUS_UPDATE_MUTATION,
        variables: { ids: messageIds },
      })
      .pipe(map(({ data }) => data?.updateReadStatus));
  }
}
