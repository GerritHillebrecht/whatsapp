import { WhatsappContact, WhatsappUser } from '@whatsapp/interface';

export class FetchContacts {
  static readonly type = '[WhatsApp Contact] Fetch contacts';
  constructor(public id: number) {}
}

export class SetContacts {
  static readonly type = '[WhatsApp Contact] Set contacts';
  constructor(public contacts: WhatsappUser[]) {}
}

export class SelectWhatsappContact {
  static readonly type = '[WhatsApp Contact] Select contact';
  constructor(public selectedContact: WhatsappContact) {}
}

export class ResetWhatsappConctactState {
  static readonly type = '[WhatsApp Contact] Reset state';
}

export class SetContactsLoadingState {
  static readonly type = '[WhatsApp Contact] Set loading state';
  constructor(public loadingState: boolean) {}
}
