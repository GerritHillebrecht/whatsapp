import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faFacebook,
  faGithub,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { AuthenticationService } from '../service/authentication.service';

interface TestUser {
  image: string;
  displayName: string;
  email: string;
}

@Component({
  selector: 'app-authentication-layout',
  templateUrl: './authentication-layout.component.html',
  styleUrls: ['./authentication-layout.component.scss'],
})
export class AuthenticationLayoutComponent {
  form: FormGroup;
  google = faGoogle;
  facebook = faFacebook;
  github = faGithub;

  testUsers: TestUser[] = [
    {
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
      displayName: 'John Doe',
      email: 'john.doe@mail.com',
    },
    {
      image:
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80',
      displayName: 'Max Mustermann',
      email: 'max.mustermann@mail.com',
    },
    {
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80',
      displayName: 'Sara Schmid',
      email: 'saraschmid@dayrep.com',
    },
    {
      image:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=461&q=80',
      displayName: 'Jana Scherer',
      email: 'janascherer@armyspy.com',
    },
  ];

  constructor(private auth: AuthenticationService, private router: Router) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  googleLogin() {
    this.auth
      .loginWithGoogle()
      .then(() => this.redirect())
      .catch((error) => console.error(error));
  }

  emailAndPasswordLogin(email: string, password: string) {
    this.auth
      .loginWithEmail(email, password)
      .then(() => this.redirect())
      .catch((error) => console.error(error));
  }

  testUserClickHandler(user: TestUser) {
    this.emailAndPasswordLogin(user.email, 'abc123');
  }

  private redirect() {
    this.router.navigate(['/whatsapp']);
  }
}
