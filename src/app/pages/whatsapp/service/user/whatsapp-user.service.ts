import { Injectable } from '@angular/core';
import { AuthenticationService } from '@auth/service';
import { AuthenticationState } from '@auth/store';
import { NotificationService } from '@core/services/notification';
import { Store } from '@ngxs/store';
import { WhatsappUser } from '@whatsapp/interface';
import { WhatsappState } from '@whatsapp/store';
import {
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  retryWhen,
  skip,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WhatsappUserService {
  constructor(
    private authService: AuthenticationService,
    private notification: NotificationService,
    private store: Store
  ) {}

  whatsAppUser(): Observable<WhatsappUser | null> {
    let retryCount = 1;
    return this.store.select(AuthenticationState.firebaseUser).pipe(
      distinctUntilChanged((a, b) => a?.uid === b?.uid),
      switchMap((firebaseUser) => {
        return firebaseUser
          ? this.authService.getUserData(firebaseUser)
          : of(null);
      }),
      catchError((error) => {
        this.notification.serverConnectionError(retryCount++);
        return throwError(() => new Error('Error while fetching data', error));
      }),
      retryWhen((errors) => errors.pipe(delay(5000), take(5))),
      map((whatsappUser) => (whatsappUser ? whatsappUser : null))
    );
  }

  initSync(): Observable<WhatsappUser['id']> {
    return this.store.select(WhatsappState.whatsappUser).pipe(
      distinctUntilChanged((a, b) => a?.id === b?.id),
      filter((whatsappUser) => Boolean(whatsappUser)),
      map((whatsappUser) => whatsappUser as WhatsappUser),
      map(({ id }) => id)
    );
  }
}
