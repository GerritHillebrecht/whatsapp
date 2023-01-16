import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { AuthenticationService } from '@auth/service';
import { firstValueFrom } from 'rxjs';
import { WhatsappMessage, WhatsappContact } from '../interface';
import { SynchronisationService } from '../service';
import {
  SelectContact,
  SubscribeToMessages,
  SyncWithServer,
  UpdateContacts,
} from './whatsapp.actions';

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
    private syncService: SynchronisationService
  ) {}

  ngxsOnInit({ dispatch }: StateContext<WhatsappStateModel>) {
    dispatch(new SyncWithServer());
    dispatch(new SubscribeToMessages());
  }

  @Action(SyncWithServer)
  async sync({ dispatch }: StateContext<WhatsappStateModel>) {
    const currentUser = await firstValueFrom(this.auth.user$);
    if (!currentUser) return;

    this.syncService.syncDataWithServer(currentUser.id).subscribe({
      next: (contacts) => dispatch(new UpdateContacts(contacts)),
      error: (err) => console.error(err),
    });
  }

  @Action(SubscribeToMessages)
  subscribeToMessages({ dispatch }: StateContext<WhatsappStateModel>) {
    this.syncService.messageSubscription().subscribe({
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
