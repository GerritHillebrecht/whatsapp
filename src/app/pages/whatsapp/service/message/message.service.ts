import { Injectable } from '@angular/core';

import { Apollo } from 'apollo-angular';
import { map, Observable, take } from 'rxjs';
import { WhatsappMessage } from '@whatsapp/interface';
import { MessageComposeService } from '../message-compose/message-compose.service';
import { Store } from '@ngxs/store';
import {
  SYNCHRONIZATION_QUERY,
  SyncQueryResult,
} from '../synchronisation/sync.query';
import {
  MessageCreateResult,
  MessageCreateVariables,
  MESSAGE_CREATE_MUTATION,
} from '@pages/test-bench/personal-testing/graphql-optimistic-response/typedDocumentNodes.graphql';

import uniqid from 'uniqid';

import {
  ReadStatusUpdateResult,
  ReadStatusUpdateVariables,
  READ_STATUS_UPDATE_MUTATION,
} from './message.graphql';



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
    const body = this.compose.messageControl.value;
    this.compose.messageControl.reset();
    const [receiver, sender] = this.store.selectSnapshot((state) => [
      state.whatsapp.selectedContact,
      state.authentication.whatsappUser,
    ]);
    const variables = {
      uuid: uniqid(),
      body,
      receiverId: receiver.id,
      senderId: sender.id,
    };

    return this.apollo
      .mutate<MessageCreateResult, MessageCreateVariables>({
        mutation: MESSAGE_CREATE_MUTATION,
        variables,
        optimisticResponse: {
          __typename: 'Mutation',
          saveMessage: {
            __typename: 'Message',
            id: 0,
            uuid: variables.uuid,
            body,
            image: '',
            isRead: false,
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
        },
        update: (cache, result) => {
          const cachedData = cache.readQuery<SyncQueryResult, { id: number }>({
            query: SYNCHRONIZATION_QUERY,
            variables: {
              id: this.store.snapshot().authentication.whatsappUser.id,
            },
          });

          // If there is no data in the cache, we don't need to update it
          if (!cachedData || !result.data) return;

          const { messages, contacts } = cachedData;
          const { saveMessage } = result.data;

          const message = {
            ...saveMessage,
            sender: this.store.snapshot().authentication.whatsappUser,
            receiver: this.store.snapshot().whatsapp.selectedContact,
          };

          const data = {
            contacts,
            messages: [message, ...messages],
          };

          // Write the new data to the cache
          cache.writeQuery({
            query: SYNCHRONIZATION_QUERY,
            variables: { id: message.sender.id },
            data,
          });
        },
      })
      .pipe(
        map((result: any) => result.data.sendMessage),
        take(1)
      );
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
