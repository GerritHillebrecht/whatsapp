import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { WhatsappContact, WhatsappUser } from '../interface';
import {
  ResetWhatsappState,
  SetLoadingState,
  SetWhatsappUser,
} from './whatsapp.actions';
import { MessageMap } from '@whatsapp/service/synchronisation/synchronisation.service';
import { WhatsappUserService } from '@whatsapp/service/user';
import { FetchContacts } from './contact/contact.actions';
import {
  FetchMessages,
  SubscribeToMessages,
  SubscribeToReadUpdates,
} from './message/message.actions';

export interface WhatsappStateModel {
  whatsappUser: WhatsappUser | null;
  selectedContact: WhatsappContact | null;
  contacts: WhatsappContact[];
  messages: MessageMap;
  loadingState: boolean;
}

const defaults: WhatsappStateModel = {
  whatsappUser: null,
  selectedContact: null,
  contacts: [],
  loadingState: false,
  messages: {},
};

@State<WhatsappStateModel>({
  name: 'whatsapp',
  defaults,
})
@Injectable()
export class WhatsappState implements NgxsOnInit {
  @Selector()
  static whatsappUser({ whatsappUser }: WhatsappStateModel) {
    return whatsappUser;
  }

  constructor(private whatsAppService: WhatsappUserService) {}

  ngxsOnInit({ dispatch }: StateContext<WhatsappStateModel>) {
    this.whatsAppService
      .whatsAppUser()
      .subscribe((whatsAppUser) => dispatch(new SetWhatsappUser(whatsAppUser)));

    this.whatsAppService.initSync().subscribe((whatsAppUserId) => {
      dispatch([
        new FetchContacts(whatsAppUserId),
        new FetchMessages(whatsAppUserId),
        new SubscribeToMessages(whatsAppUserId),
        new SubscribeToReadUpdates(whatsAppUserId),
      ]);
    });
  }

  @Action(SetWhatsappUser)
  setWhatsappUser(
    { patchState }: StateContext<WhatsappStateModel>,
    { whatsappUser }: SetWhatsappUser
  ) {
    patchState({ whatsappUser });
  }

  @Action(SetLoadingState)
  setLoadingState(
    { patchState }: StateContext<WhatsappStateModel>,
    { loadingState }: SetLoadingState
  ) {
    patchState({ loadingState });
  }

  @Action(ResetWhatsappState)
  resetState({ setState }: StateContext<WhatsappStateModel>) {
    setState(defaults);
  }
}
