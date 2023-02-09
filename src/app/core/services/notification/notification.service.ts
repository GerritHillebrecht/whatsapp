import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public notification$: Subject<string> = new Subject();

  constructor() {}

  serverConnectionError(attempt: number = 0, max: number = 5): void {
    console.log('Server connection error', attempt, max);
    const message =
      attempt < max
        ? `Es konnte keine Verbindung zum Server hergestellt werden. Neuer Versuch (${attempt})`
        : 'Es konnte keine Verbindung zum Server hergestellt werden. Bitte versuchen Sie es später erneut.';
    this.notification$.next(message);
  }
}
