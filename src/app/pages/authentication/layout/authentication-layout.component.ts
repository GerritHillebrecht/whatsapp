import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-authentication-layout',
  templateUrl: './authentication-layout.component.html',
  styleUrls: ['./authentication-layout.component.scss'],
})
export class AuthenticationLayoutComponent {
  constructor(private auth: AuthenticationService, private router: Router) {}

  googleLogin() {
    this.auth
      .loginWithGoogle()
      .then(() => {
        this.router.navigate(['/whatsapp']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
