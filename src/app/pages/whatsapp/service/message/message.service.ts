import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { map, Observable, take, tap } from 'rxjs';
import { WhatsappMessage, WhatsappUser } from '@whatsapp/interface';
import { MessageComposeService } from '../message-compose/message-compose.service';
import { Store } from '@ngxs/store';
import uniqid from 'uniqid';

import {
  MessageQueryResult,
  MessageQueryVariables,
  MESSAGE_QUERY,
  SYNCHRONIZATION_QUERY,
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

interface OptimisticResponseVariables {
  uuid: string;
  body: string;
  sender: WhatsappUser;
  receiver: WhatsappUser;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private apollo: Apollo,
    private compose: MessageComposeService,
    private store: Store
  ) {}

  sendMessage(): Observable<WhatsappMessage> {
    const [sender, receiver] = [
      this.store.selectSnapshot(WhatsappState.whatsappUser)!,
      this.store.selectSnapshot(WhatsappContactState.selectedContact)!,
    ];

    const uuid = uniqid();
    const body = this.compose.messageControl.value;

    const variables: MessageCreateVariables = {
      uuid,
      body,
      receiverId: receiver.id,
      senderId: sender.id,
    };

    console.log('variables', variables);

    const optimisticResponse: MessageCreateResult =
      this.createOptimisticResponse({
        uuid,
        body,
        sender,
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

          const cacheQueryOptions = {
            query: MESSAGE_QUERY,
            variables: { id },
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
        },
      })
      .pipe(
        tap(() => this.compose.messageControl.reset()),
        map((result: any) => result.data.sendMessage),
        take(1)
      );
  }

  private updateCache(cache: ApolloCache<any>, data: MessageCreateResult) {
    // const { id } = this.store.selectSnapshot(WhatsappState.whatsappUser)!;
    // const cacheQueryOptions = {
    //   query: MESSAGE_QUERY,
    //   variables: { id },
    // };
    // cache.updateQuery(cacheQueryOptions, (data: MessageQueryResult | null) => {
    //   return {
    //     __typename: 'Query',
    //     ...data,
    //   };
    // });
    // const cachedData = cache.readQuery<
    //   MessageQueryResult,
    //   MessageQueryVariables
    // >({
    //   query: MESSAGE_QUERY,
    //   variables: { id: whatsappUser.id },
    // });
    // if (!cachedData) return;
    // const { messages } = cachedData;
    // const { saveMessage } = data;
    // const message = {
    //   ...saveMessage,
    //   sender: whatsappUser,
    //   receiver: this.store.snapshot().whatsapp.selectedContact,
    // };
    // cache.writeQuery({
    //   query: MESSAGE_QUERY,
    //   variables: { id: whatsappUser.id },
    //   data: {
    //     messages: [message, ...messages],
    //   },
    // });
  }

  private createOptimisticResponse({
    uuid,
    body,
    sender,
    receiver,
  }: OptimisticResponseVariables): MessageCreateResult {
    return {
      __typename: 'Mutation',
      saveMessage: {
        __typename: 'Message',
        id: 0,
        uuid: uuid,
        body,
        image: '',
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
