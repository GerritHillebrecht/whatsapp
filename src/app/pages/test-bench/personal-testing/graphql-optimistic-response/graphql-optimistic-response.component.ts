import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { WhatsappMessage, WhatsappMessageQueryDto } from '@whatsapp/interface';
import { map } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { take } from 'rxjs';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  MESSAGE_QUERY,
  MessageQueryResult,
  MessageQueryVariables,
  MESSAGE_CREATE_MUTATION,
  MessageCreateResult,
  MessageCreateVariables,
  MESSAGE_UPDATE_MUTATION,
  MessageUpdateResult,
  MessageUpdateVariables,
  MESSAGE_DELETE_MUTATION,
  MessageDeleteResult,
  MessageDeleteVariables,
} from './typedDocumentNodes.graphql';

@Component({
  selector: 'app-graphql-optimistic-response',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './graphql-optimistic-response.component.html',
  styleUrls: ['./graphql-optimistic-response.component.scss'],
})
export class GraphqlOptimisticResponseComponent {
  readonly whatsappMessages$ = this.getMessages();
  readonly form: FormGroup;

  constructor(private apollo: Apollo, private store: Store) {
    this.form = new FormGroup({
      body: new FormControl(),
    });
  }

  private getMessages() {
    const id = this.store.snapshot().authentication.user.id;
    return this.apollo
      .watchQuery<MessageQueryResult, MessageQueryVariables>({
        query: MESSAGE_QUERY,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data.messages));
  }

  private saveMessage(body: string): Observable<any> {
    return this.apollo
      .mutate<MessageCreateResult>({
        mutation: MESSAGE_CREATE_MUTATION,
        variables: { body },
        optimisticResponse: () => ({
          __typename: 'Mutation',
          saveMessage: {
            __typename: 'Message',
            id: 0,
            uuid: '0',
            body: this.form.get('body')?.value,
            isMine: true,
            sender: {
              __typename: 'User',
              ...this.store.snapshot().authentication.user,
            },
            receiver: {
              __typename: 'User',
              ...this.store.snapshot().whatsapp.selectedContact,
            },
            deliveryStatus: 'pending' as WhatsappMessage['deliveryStatus'],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        update: (cache, { data }) => {
          // Read the data from the cache
          const cachedData = cache.readQuery<MessageQueryResult>({
            query: MESSAGE_QUERY,
            variables: {
              id: this.store.snapshot().authentication.user.id,
            },
          });

          // If there is no data in the cache, we don't need to update it
          if (!cachedData || !data) return;

          const { messages } = cachedData;
          const { saveMessage } = data;

          console.log({ saveMessage });

          const message = {
            ...saveMessage,
            sender: this.store.snapshot().authentication.user,
            receiver: this.store.snapshot().whatsapp.selectedContact,
          };

          // Write the new data to the cache
          cache.writeQuery({
            query: MESSAGE_QUERY,
            variables: { id: message.sender.id },
            data: { messages: [message, ...messages] },
          });
        },
        // End of Updating the cache with the new message
      })
      .pipe(map((result) => result.data?.saveMessage));
  }

  private updateMessage(message: WhatsappMessageQueryDto) {
    const { id, body: body, createdAt } = message;
    return this.apollo.mutate<MessageUpdateResult, MessageUpdateVariables>({
      mutation: MESSAGE_UPDATE_MUTATION,
      variables: { id, body },
      optimisticResponse: {
        __typename: 'Mutation',
        updateMessage: {
          __typename: 'Message',
          id,
          uuid: message.uuid,
          body: body,
          sender: this.store.snapshot().authentication.user,
          receiver: this.store.snapshot().whatsapp.selectedContact,
          deliveryStatus: 'pending' as WhatsappMessage['deliveryStatus'],
          createdAt,
          updatedAt: new Date(),
        },
      },
    });
  }

  private deleteMessage(message: WhatsappMessageQueryDto) {
    return this.apollo.mutate<MessageDeleteResult, MessageDeleteVariables>({
      mutation: MESSAGE_DELETE_MUTATION,
      variables: { id: message.id },
      optimisticResponse: () => {
        return {
          __typename: 'Mutation',
          deleteMessage: {
            __typename: 'Message',
            ...message,
          },
        };
      },
      update: (cache, { data }) => {
        const id = this.store.snapshot().authentication.user.id;
        const cacheData = cache.readQuery<MessageQueryResult>({
          query: MESSAGE_QUERY,
          variables: { id },
        });

        console.log({ cacheData });
        if (!cacheData || !data) return;

        const { deleteMessage } = data;
        const { messages } = cacheData;

        cache.writeQuery({
          query: MESSAGE_QUERY,
          variables: { id },
          data: {
            messages: messages.filter(
              (message) => message.id !== deleteMessage.id
            ),
          },
        });
      },
    });
  }

  protected handleUpdate(message: WhatsappMessageQueryDto) {
    this.updateMessage({ ...message, body: message.body + ' updated' })
      .pipe(take(1))
      .subscribe({
        error: (error) => {
          console.error('ERROR UPDATING THE MESSAGE', error);
        },
      });
  }

  protected handleSubmit() {
    this.saveMessage(this.form.get('body')?.value)
      .pipe(take(1))
      .subscribe({
        error: (error) => {
          console.error('ERROR SAVING THE MESSAGE', error);
        },
      });
  }

  handleDelete(message: WhatsappMessageQueryDto) {
    this.deleteMessage(message)
      .pipe(take(1))
      .subscribe({
        error: (error) => {
          console.error('ERROR DELETING THE MESSAGE', error);
        },
      });
  }
}
