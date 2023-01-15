import { Injectable } from '@angular/core';
import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import { WhatsappUser } from '@whatsapp/interface';
import { SetAuthenticatedUser } from './authentication.actions';

export interface AuthenticationStateModel {
  user: WhatsappUser | null;
}

@State<AuthenticationStateModel>({
  name: 'authentication',
  defaults: {
    user: null,
  },
})
@Injectable()
export class AuthenticationState implements NgxsOnInit {
  @Selector()
  static user({ user }: AuthenticationStateModel): WhatsappUser | null {
    return user;
  }

  ngxsOnInit(ctx: StateContext<any>): void {}

  @Action(SetAuthenticatedUser)
  setUser(
    { patchState }: StateContext<AuthenticationStateModel>,
    { whatsappUser }: SetAuthenticatedUser
  ) {
    patchState({ user: whatsappUser });
  }
}
