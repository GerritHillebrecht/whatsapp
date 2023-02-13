import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoginWithCredentials,
  LoginWithGoogle,
} from '@auth/store/authentication.actions';
import {
  faFacebook,
  faGithub,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
import { Store } from '@ngxs/store';
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
      image: 'http://afernandes.adv.br/wp-content/uploads/Team-Member-3.jpg',
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
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
      displayName: 'Jana Scherer',
      email: 'janascherer@armyspy.com',
    },
  ];

  constructor(private store: Store) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  googleLogin() {
    this.store.dispatch(new LoginWithGoogle());
  }

  loginWithCredentials(email: string, password: string) {
    this.store.dispatch(new LoginWithCredentials(email, password));
  }

  testUserClickHandler(user: TestUser) {
    this.loginWithCredentials(user.email, 'abc123');
  }
}
