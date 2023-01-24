import { Component, OnInit } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { AuthenticationState, AuthenticationStateModel } from '@auth/store';
import { Select, Store } from '@ngxs/store';
import { WhatsappUser } from '@whatsapp/interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @Select(AuthenticationState)
  authState$: Observable<AuthenticationStateModel> | undefined;

  @Select(AuthenticationState)
  authenticationState$: Observable<AuthenticationStateModel> | undefined;

  @Select((state: any) => state.authentication.firebaseUser)
  firebaseUser$: Observable<User | null> | undefined;

  @Select((state: any) => state.authentication.whatsappUser)
  whatsappUser$: Observable<WhatsappUser | null> | undefined;

  constructor(private store: Store, private auth: Auth) {}

  ngOnInit(): void {
    // this.authState$?.subscribe((state) => {
    //   console.log('authState$', state);
    // });

    // this.authenticationState$?.subscribe((state) => {
    //   console.log('authenticationState$', state);
    // });

    // this.firebaseUser$?.subscribe((firebaseUser) => {
    //   console.log({ firebaseUser });
    // });

    // this.whatsappUser$?.subscribe((whatsappUser) => {
    //   console.log({ whatsappUser });
    // });

    // this.store
    //   .select(
    //     ({
    //       authentication: { whatsappUser },
    //     }: {
    //       authentication: AuthenticationStateModel;
    //     }) => whatsappUser
    //   )
    //   .subscribe((whatsappUser) => {
    //     console.log({ whatsappUser });
    //   });
  }
}
