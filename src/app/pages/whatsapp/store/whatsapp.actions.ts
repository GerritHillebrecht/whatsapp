import { WhatsappContact, WhatsappMessage } from '../interface';

export class SyncWithServer {
  static readonly type = '[Whatsapp] Synchronize with server';
  constructor(public id: number) {}
}

export class SubscribeToMessages {
  static readonly type = '[Whatsapp] Subscribe to messages';
  constructor(public id: number) {}
}

export class SelectContact {
  static readonly type = '[Whatsapp] Select contact';
  constructor(public selectedContact: WhatsappContact) {}
}

export class UpdateContacts {
  static readonly type = '[Whatsapp] Update contacts';
  constructor(public contacts: WhatsappContact[]) {}
}
