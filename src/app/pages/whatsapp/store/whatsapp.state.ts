import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  NgxsOnInit,
  Selector,
  Store,
} from '@ngxs/store';
import { AuthenticationService } from '@auth/service';
import { WhatsappMessage, WhatsappContact } from '../interface';
import { SynchronisationService } from '../service';
import {
  SelectContact,
  SubscribeToMessages,
  SyncWithServer,
  UpdateContacts,
} from './whatsapp.actions';
import { AuthenticationStateModel as ASM } from '@auth/store';
import { filter } from 'rxjs';

export interface WhatsappStateModel {
  selectedContact: WhatsappContact | null;
  contacts: WhatsappContact[];
}

@State<WhatsappStateModel>({
  name: 'whatsapp',
  defaults: {
    selectedContact: null,
    contacts: [],
  },
})
@Injectable()
export class WhatsappState implements NgxsOnInit {
  @Selector<WhatsappMessage[]>()
  static displayedMessages({
    selectedContact,
    contacts,
  }: WhatsappStateModel): WhatsappMessage[] | null {
    if (!selectedContact) return null;
    return contacts.find((c) => selectedContact?.id === c.id)?.messages || [];
  }

  constructor(
    private auth: AuthenticationService,
    private store: Store,
    private syncService: SynchronisationService
  ) {}

  ngxsOnInit({ dispatch }: StateContext<WhatsappStateModel>) {
    this.store
      .select(
        ({ authentication }: { authentication: ASM }) => authentication.user
      )
      .pipe(filter((user) => Boolean(user)))
      .subscribe((user) => {
        dispatch(new SyncWithServer(user!.id));
        dispatch(new SubscribeToMessages(user!.id));
      });
  }

  @Action(SyncWithServer)
  async sync(
    { dispatch }: StateContext<WhatsappStateModel>,
    { id }: SyncWithServer
  ) {
    this.syncService.syncDataWithServer(id).subscribe({
      next: (contacts) => dispatch(new UpdateContacts(contacts)),
      error: (err) => console.error(err),
    });
  }

  @Action(SubscribeToMessages)
  subscribeToMessages(
    { dispatch }: StateContext<WhatsappStateModel>,
    { id }: SubscribeToMessages
  ) {
    this.syncService.messageSubscription(id).subscribe({
      next: (contacts) => dispatch(new UpdateContacts(contacts)),
      error: (err) => console.error(err),
    });
  }

  @Action(UpdateContacts)
  updateContacts(
    { patchState }: StateContext<WhatsappStateModel>,
    { contacts }: UpdateContacts
  ) {
    patchState({ contacts });
  }

  @Action(SelectContact)
  selectContact(
    { patchState }: StateContext<WhatsappStateModel>,
    { selectedContact }: SelectContact
  ) {
    patchState({ selectedContact });
  }
}
