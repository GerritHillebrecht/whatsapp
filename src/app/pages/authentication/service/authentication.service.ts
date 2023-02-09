import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseUser } from '@auth/interface';
import { WhatsappUser } from '@pages/whatsapp/interface';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, map } from 'rxjs';
import { Observable } from 'rxjs';
import { userQuery } from './user.query';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public readonly fetchingAuthState$ = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: Auth,
    private apollo: Apollo,
    private router: Router
  ) {}

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

  getUserData(user: FirebaseUser): Observable<WhatsappUser | null> {
    return this.apollo
      .query<{ user: WhatsappUser }, { id: string }>({
        query: userQuery,
        variables: {
          id: user?.uid,
        },
      })
      .pipe(map(({ data }) => data?.user || null));
  }
}
