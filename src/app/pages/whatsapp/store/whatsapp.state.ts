import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  NgxsOnInit,
  Selector,
  Store,
  createSelector,
} from '@ngxs/store';
import { WhatsappMessage, WhatsappContact, WhatsappUser } from '../interface';
import { MessageService, SynchronisationService } from '../service';
import {
  AddMessage,
  AddMessages,
  ResetWhatsappState,
  SelectContact,
  SubscribeToMessages,
  SubscribeToReadStatus,
  SyncWithServer,
  UpdateContacts,
  UpdateReadStatus,
} from './whatsapp.actions';
import {
  AuthenticationState,
  AuthenticationStateModel as ASM,
} from '@auth/store';
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  tap,
} from 'rxjs';

export interface WhatsappStateModel {
  selectedContact: WhatsappContact | null;
  contacts: WhatsappContact[];
  messages: Map<number, WhatsappMessage[]>;
  loadingStates: {
    sync: boolean;
  };
}

@State<WhatsappStateModel>({
  name: 'whatsapp',
  defaults: {
    selectedContact: null,
    contacts: [],
    loadingStates: {
      sync: false,
    },
    messages: new Map(),
  },
})
@Injectable()
export class WhatsappState implements NgxsOnInit {
  // Selectors
  @Selector<WhatsappMessage[]>()
  static displayedMessages({
    selectedContact,
    contacts,
  }: WhatsappStateModel): WhatsappMessage[] | null {
    if (!selectedContact) return null;
    return contacts.find((c) => selectedContact?.id === c.id)?.messages || [];
  }

  static messages(offset: number = 0, limit: number = 10) {
    return createSelector(
      [WhatsappState],
      ({ selectedContact, messages }: WhatsappStateModel) => {
        if (!selectedContact) return [];
        const filteredMessages = messages.get(selectedContact.id) || [];
        return filteredMessages.slice(offset, offset + limit);
      }
    );
  }

  @Selector<boolean>()
  static syncLoading(state: WhatsappStateModel): boolean {
    return state.loadingStates.sync;
  }

  constructor(
    private store: Store,
    private messageService: MessageService,
    private syncService: SynchronisationService
  ) {}

  ngxsOnInit({ dispatch }: StateContext<WhatsappStateModel>) {
    this.store
      .select(AuthenticationState.whatsappUser)
      .pipe(filter((user) => Boolean(user)))
      .subscribe((user) => {
        const { id } = user!;
        dispatch(new SyncWithServer(id));
        dispatch(new SubscribeToMessages(id));
      });
  }

  @Action(SyncWithServer)
  async sync(
    { dispatch, patchState }: StateContext<WhatsappStateModel>,
    { id }: SyncWithServer
  ) {
    patchState({ loadingStates: { sync: true } });
    this.syncService.syncDataWithServer(id).subscribe({
      next: ({ contacts, messageMap }) => {
        patchState({ loadingStates: { sync: false } });
        dispatch(new UpdateContacts(contacts));
        dispatch(new AddMessages(messageMap));
      },
      error: (err) => console.error(err),
      complete: () => {},
    });
  }

  @Action(SubscribeToMessages)
  subscribeToMessages(
    { dispatch }: StateContext<WhatsappStateModel>,
    { id }: SubscribeToMessages
  ) {
    this.syncService.messageSubscription(id).subscribe({
      next: ({ contacts, message }) => {
        dispatch(new AddMessage(message));
        dispatch(new UpdateContacts(contacts));
      },
      error: (err) => console.error(err),
      complete: () => {
        console.log(
          '%cMessage Subscription Terminated, user emitted value',
          'font-size: 40px; color: green;'
        );
      },
    });
  }

  @Action(SubscribeToReadStatus)
  subscribeToReadStatus(
    { dispatch }: StateContext<WhatsappStateModel>,
    { id }: SubscribeToReadStatus
  ) {
    // this.syncService.readStatusSubscription(id).subscribe({
    //   next: (contacts) => dispatch(new UpdateContacts(contacts)),
    //   error: (err) => console.error(err),
    //   complete: () => {
    //     console.log(
    //       '%cRead Status Subscription Terminated, user emitted value',
    //       'font-size: 40px; color: green;'
    //     );
    //   },
    // });
  }

  @Action(SelectContact)
  selectContact(
    { patchState }: StateContext<WhatsappStateModel>,
    { selectedContact }: SelectContact
  ) {
    patchState({ selectedContact });
  }

  @Action(AddMessage)
  addMessage(
    { patchState, getState }: StateContext<WhatsappStateModel>,
    { message }: AddMessage
  ) {
    const { messages } = getState();
    const { sender, receiver } = message;
    const currentUserId = this.store.selectSnapshot(
      AuthenticationState.whatsappUser
    )?.id;
    const contactId = currentUserId === sender.id ? receiver.id : sender.id;
    const contactMessages = messages.get(contactId) || [];
    messages.set(contactId, [message, ...contactMessages]);
    patchState({ messages });
  }

  @Action(AddMessages)
  addMessages(
    { patchState }: StateContext<WhatsappStateModel>,
    { messages }: AddMessages
  ) {
    patchState({ messages });
  }

  @Action(UpdateContacts)
  updateContacts(
    { patchState }: StateContext<WhatsappStateModel>,
    { contacts }: UpdateContacts
  ) {
    patchState({ contacts });
  }

  @Action(UpdateReadStatus)
  updateReadStatus(
    { patchState, getState }: StateContext<WhatsappStateModel>,
    { messages }: UpdateReadStatus
  ) {
    this.messageService.updateReadStatus(messages.map((m) => m.id)).subscribe({
      next: (updatedMessages) => {
        console.log('updated messages', updatedMessages);
      },
    });
  }

  @Action(ResetWhatsappState)
  resetState({ setState }: StateContext<WhatsappStateModel>) {
    setState({
      selectedContact: null,
      contacts: [],
      messages: new Map(),
      loadingStates: {
        sync: false,
      },
    });
  }
}
