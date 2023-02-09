import { inject, Injectable } from '@angular/core';
import {
  Action,
  createSelector,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
  Store,
} from '@ngxs/store';
import {
  WhatsappContact,
  WhatsappMessage,
  WhatsappUser,
} from '@whatsapp/interface';
import { SynchronisationService } from '@whatsapp/service';
import { Observable } from 'rxjs';
import {
  WhatsappMessageState,
  WhatsappMessageStateModel,
} from '../message/message.state';
import { WhatsappState } from '../whatsapp.state';
import {
  ResetWhatsappConctactState,
  SelectWhatsappContact,
  SetContactsLoadingState,
  SetContacts,
  FetchContacts,
} from './contact.actions';

export interface WhatsappContactStateModel {
  contacts: WhatsappUser[];
  selectedContact: WhatsappContact | null;
  loadingState: boolean;
}

const defaults: WhatsappContactStateModel = {
  contacts: [],
  selectedContact: null,
  loadingState: false,
};

@State<WhatsappContactStateModel>({
  name: 'whatsappContacts',
  defaults,
})
@Injectable()
export class WhatsappContactState implements NgxsOnInit {
  @Selector<WhatsappContact>()
  static selectedContact({ selectedContact }: WhatsappContactStateModel) {
    return selectedContact;
  }

  @Selector<WhatsappContact>()
  static loadingState({ loadingState }: WhatsappContactStateModel) {
    return loadingState;
  }

  static contacts() {
    return createSelector(
      [WhatsappMessageState, WhatsappContactState],
      (
        { messages }: { messages: WhatsappMessage[] },
        { contacts }: { contacts: WhatsappUser[] }
      ) => {
        return contacts.map((contact) => {
          const contactMessages = messages.filter(({ receiver, sender }) =>
            [receiver.id, sender.id].includes(contact.id)
          );

          const lastMessage = contactMessages.at(-1) || null;
          const unreadMessages = contactMessages.filter(
            ({ deliveryStatus, isMine }) => !isMine && deliveryStatus !== 'read'
          ).length;

          return {
            ...contact,
            lastMessage,
            unreadMessages,
          } as WhatsappContact;
        });
      }
    );
  }

  constructor(private syncService: SynchronisationService) {}

  ngxsOnInit(ctx: StateContext<any>): void {}

  @Action(FetchContacts)
  fetchContacts(
    { dispatch }: StateContext<WhatsappContactStateModel>,
    { id }: FetchContacts
  ) {
    dispatch(new SetContactsLoadingState(true));
    this.syncService.fetchContacts(id).subscribe((contacts) => {
      dispatch(new SetContacts(contacts));
    });
  }

  @Action(SetContacts)
  setContacts(
    { patchState }: StateContext<WhatsappContactStateModel>,
    { contacts }: SetContacts
  ) {
    patchState({ contacts, loadingState: false });
  }

  @Action(SelectWhatsappContact)
  selectContact(
    { patchState }: StateContext<WhatsappContactStateModel>,
    { selectedContact }: SelectWhatsappContact
  ) {
    patchState({ selectedContact });
  }

  @Action(SetContactsLoadingState)
  setLoadingState(
    { patchState }: StateContext<WhatsappContactStateModel>,
    { loadingState }: SetContactsLoadingState
  ) {
    patchState({ loadingState });
  }

  @Action(ResetWhatsappConctactState)
  resetState({ setState }: StateContext<WhatsappContactStateModel>) {
    setState(defaults);
  }
}
