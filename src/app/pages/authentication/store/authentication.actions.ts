import { FirebaseUser } from '@auth/interface';
import { WhatsappUser } from '@whatsapp/interface';

export class LoginWithGoogle {
  static type = '[Authentication] Login with Google';
}

export class LoginWithFacebook {
  static readonly type = '[Authentication] Login with Facebook';
}

export class LoginWithGithub {
  static readonly type = '[Authentication] Login with Github';
}

export class LoginWithCredentials {
  static readonly type = '[Authentication] Login with credentials';
  constructor(public email: string, public password: string) {}
}

export class Logout {
  static readonly type = '[Authentication] Logout';
}

// Utitlity Actions
export class SetAuthenticatedUser {
  static readonly type = '[Authentication] Set authenticated user';
  constructor(public user: WhatsappUser | null) {}
}

export class SetFirebaseUser {
  static type = '[Authentication] Set Firebase user';
  constructor(public firebaseUser: FirebaseUser | null) {}
}

export class SetWhatsappUser {
  static readonly type = '[Authentication] Set Whatsapp user';
  constructor(public whatsappUser: WhatsappUser | null) {}
}

export class RediretToWhatsapp {
  static readonly type = '[Authentication] Redirect to Whatsapp';
}
