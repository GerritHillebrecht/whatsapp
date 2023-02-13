import { Injectable, inject } from '@angular/core';
import {
  Action,
  createSelector,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import { WhatsappMessage } from '@whatsapp/interface';
import { MessageService, SynchronisationService } from '@whatsapp/service';
import { WhatsappContactState } from '../contact/contact.state';
import {
  AddWhatsappMessage,
  FetchMessages,
  ResetWhatsappMessageState,
  SendMessage,
  SetMessageLoadingState,
  SetMessages,
  SubscribeToMessages,
  SubscribeToReadUpdates,
  UpdateReadStatus,
} from './message.actions';
import { WhatsappContactStateModel } from '../contact/contact.state';
import { MessageSubscriptionService } from '@whatsapp/service/subscription/message/message-subscription.service';
import { ReadUpdateSubscriptionService } from '@whatsapp/service/subscription/read-status/read-update-subscription.service';
import { QUERY_LIMIT } from '@whatsapp/tokens';

export interface WhatsappMessageStateModel {
  loadingState: boolean;
  messages: WhatsappMessage[];
}

const defaults: WhatsappMessageStateModel = {
  loadingState: false,
  messages: [],
};

@State<WhatsappMessageStateModel>({
  name: 'whatsappMessages',
  defaults,
})
@Injectable()
export class WhatsappMessageState {
  // @Selector()
  static messages() {
    return createSelector(
      [WhatsappMessageState, WhatsappContactState],
      (
        { messages }: WhatsappMessageStateModel,
        { selectedContact }: WhatsappContactStateModel
      ) => {
        if (!selectedContact) return [];

        const selectedMessages = messages
          .filter(({ sender, receiver }) =>
            [sender.id, receiver.id].includes(selectedContact.id)
          )
          .slice(0, this.query_limit)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        const messageIds = unreadMessageIds(
          selectedMessages,
          selectedContact.id
        );

        if (messageIds.length) {
          this.storeInstance.dispatch(new UpdateReadStatus(messageIds));
        }

        return selectedMessages;
      }
    );
  }

  private static storeInstance: Store;
  private static query_limit: number;

  constructor(
    private store: Store,
    private syncService: SynchronisationService,
    private messageService: MessageService,
    private messageSubscriptionService: MessageSubscriptionService,
    private readUpdateSubscriptionService: ReadUpdateSubscriptionService
  ) {
    WhatsappMessageState.storeInstance = this.store;
    WhatsappMessageState.query_limit = inject(QUERY_LIMIT);
  }

  @Action(FetchMessages)
  fetchMessages(
    { dispatch }: StateContext<WhatsappMessageStateModel>,
    { id }: FetchMessages
  ) {
    dispatch(new SetMessageLoadingState(true));
    this.syncService
      .fetchMessages(id)
      .subscribe((messages) => dispatch(new SetMessages(messages)));
  }

  @Action(SubscribeToMessages)
  subscribeToMessages(
    { dispatch }: StateContext<WhatsappMessageStateModel>,
    { id }: SubscribeToMessages
  ) {
    this.messageSubscriptionService.messageSubscription(id).subscribe({
      complete: () =>
        console.log('%cmessage subscription completed', 'color: red'),
    });
  }

  @Action(SubscribeToReadUpdates)
  subscribeToReadUpdates(
    { dispatch }: StateContext<WhatsappMessageStateModel>,
    { id }: SubscribeToReadUpdates
  ) {
    this.readUpdateSubscriptionService
      .readStatusUpdateSubscription(id)
      .subscribe({
        complete: () =>
          console.log(
            '%cread status update subscription completed',
            'color: red'
          ),
      });
  }

  @Action(SetMessages)
  setMessages(
    { patchState, getState }: StateContext<WhatsappMessageStateModel>,
    { messages: newMessages }: SetMessages
  ) {
    const { messages: storedMessages } = getState();
    const newMessageIds = new Set(newMessages.map((message) => message.uuid));
    const messages = [
      ...newMessages,
      ...storedMessages.filter(({ uuid }) => !newMessageIds.has(uuid)),
    ];
    patchState({
      messages,
    });
  }

  @Action(AddWhatsappMessage)
  addMessage(
    { getState, patchState }: StateContext<WhatsappMessageStateModel>,
    { message }: AddWhatsappMessage
  ) {
    patchState({
      messages: [message, ...(getState().messages || [])],
    });
  }

  @Action(UpdateReadStatus)
  updateReadStatus(
    { getState, patchState }: StateContext<WhatsappMessageStateModel>,
    { ids }: UpdateReadStatus
  ) {
    this.messageService.updateReadStatus(ids).subscribe();
  }

  @Action(SendMessage)
  async sendMessage({ dispatch }: StateContext<WhatsappMessageStateModel>) {
    dispatch(new SetMessageLoadingState(true));
    (await this.messageService.sendMessage()).subscribe(() => {
      dispatch(new SetMessageLoadingState(false));
    });
  }

  @Action(ResetWhatsappMessageState)
  resetState({ setState }: StateContext<WhatsappMessageStateModel>) {
    setState(defaults);
  }
}

function unreadMessageIds(
  messages: WhatsappMessage[],
  selectedUserId: number
): number[] {
  return messages
    .filter(({ sender, deliveryStatus, isMine }) => {
      return (
        !isMine &&
        sender.id === selectedUserId &&
        deliveryStatus === 'delivered'
      );
    })
    .map(({ id }) => id);
}
