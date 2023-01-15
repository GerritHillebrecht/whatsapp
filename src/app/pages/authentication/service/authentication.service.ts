import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  user,
  signInWithEmailAndPassword,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SetAuthenticatedUser } from '@auth/store/authentication.actions';
import { Store } from '@ngxs/store';
import { WhatsappUser } from '@pages/whatsapp/interface';
import { Apollo } from 'apollo-angular';
import { tap } from 'rxjs';
import { of } from 'rxjs';
import { BehaviorSubject, catchError, map } from 'rxjs';
import { shareReplay } from 'rxjs';
import { switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { userQuery } from './user.query';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public readonly user$: Observable<WhatsappUser | null>;
  public readonly fetchingAuthState$ = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: Auth,
    private apollo: Apollo,
    private store: Store,
    private router: Router
  ) {
    this.user$ = user(auth).pipe(
      tap(() => this.fetchingAuthState$.next(true)),
      switchMap((user) => (user ? this.getUser(user) : of(null))),
      tap((user) => {
        this.store.dispatch(new SetAuthenticatedUser(user));
        this.fetchingAuthState$.next(false);
      }),
      shareReplay(1)
    );
  }

  loginWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  loginWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<boolean> {
    this.auth.signOut();
    return this.router.navigate(['/']);
  }

  private getUser(user: User | null): Observable<WhatsappUser | null> {
    return this.apollo
      .query<{ user: WhatsappUser }>({
        query: userQuery,
        variables: {
          id: user?.uid,
        },
      })
      .pipe(map((result) => result?.data?.user || null));
  }
}
