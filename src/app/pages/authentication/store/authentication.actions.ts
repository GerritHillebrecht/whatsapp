import { WhatsappUser } from '@whatsapp/interface';

export class SetAuthenticatedUser {
  static readonly type = '[Authentication] Set authenticated user';
  constructor(public whatsappUser: WhatsappUser | null) {}
}
