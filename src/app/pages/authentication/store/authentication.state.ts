import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseUser } from '@auth/interface';
import { AuthenticationService } from '@auth/service';
import {
  State,
  Action,
  StateContext,
  NgxsOnInit,
  Selector,
  Store,
} from '@ngxs/store';
import { ResetWhatsappState } from '@whatsapp/store/whatsapp.actions';
import { catchError, of, skip, switchMap } from 'rxjs';

import {
  LoginWithCredentials,
  LoginWithGoogle,
  Logout,
  RediretToWhatsapp,
  SetFirebaseUser,
} from './authentication.actions';

export interface AuthenticationStateModel {
  firebaseUser: FirebaseUser | null;
  firebaseUserLoading: boolean;
}

@State<AuthenticationStateModel>({
  name: 'authentication',
  defaults: {
    firebaseUser: null,
    firebaseUserLoading: true,
  },
})
@Injectable()
export class AuthenticationState implements NgxsOnInit {
  @Selector()
  static firebaseUser({
    firebaseUser,
  }: AuthenticationStateModel): FirebaseUser | null {
    return firebaseUser;
  }

  constructor(
    private store: Store,
    private auth: Auth,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngxsOnInit({ dispatch }: StateContext<any>): void {
    // Subscribe to the Firebase user
    user(this.auth)
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: (firebaseUser) => {
          dispatch(new SetFirebaseUser(parseFirebaseUser(firebaseUser)));
        },
      });
  }

  @Action(SetFirebaseUser)
  setFirebaseUser(
    { patchState, getState }: StateContext<AuthenticationStateModel>,
    { firebaseUser }: SetFirebaseUser
  ) {
    if (firebaseUser?.uid !== getState().firebaseUser?.uid) {
      patchState({ firebaseUser });
    }
    patchState({ firebaseUserLoading: false });
  }

  @Action(LoginWithGoogle)
  loginWithGoogle({ dispatch }: StateContext<AuthenticationStateModel>) {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(() =>
      dispatch(new RediretToWhatsapp())
    );
  }

  @Action(LoginWithCredentials)
  loginWithCredentials(
    { dispatch }: StateContext<AuthenticationStateModel>,
    { email, password }: LoginWithCredentials
  ) {
    signInWithEmailAndPassword(this.auth, email, password).then(() =>
      dispatch(new RediretToWhatsapp())
    );
  }

  @Action(RediretToWhatsapp)
  redirectToWhatsapp() {
    this.router.navigate(['/whatsapp']);
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthenticationStateModel>) {
    this.store.dispatch(new ResetWhatsappState());
    this.authService.logout();
  }
}

function parseFirebaseUser(firebaseUser: User | null): FirebaseUser | null {
  return firebaseUser
    ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phoneNumber: firebaseUser.phoneNumber,
        isAnonymous: firebaseUser.isAnonymous,
        tenantId: firebaseUser.tenantId,
      }
    : null;
}
