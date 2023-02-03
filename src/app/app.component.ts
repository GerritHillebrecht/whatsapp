import { Component, OnInit } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationState, AuthenticationStateModel } from '@auth/store';
import { NotificationService } from '@core/services/notification';
import { Select, Store } from '@ngxs/store';
import { WhatsappUser } from '@whatsapp/interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private snackbar: MatSnackBar,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.notification.notification$.subscribe((message) => {
      this.snackbar.open(message, 'Vielen Dank', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }
}
