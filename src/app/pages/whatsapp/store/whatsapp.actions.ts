import { WhatsappContact, WhatsappMessage } from '../interface';

export class SyncWithServer {
  static readonly type = '[Whatsapp] Synchronize with server';
  constructor(public id: number) {}
}

export class SubscribeToMessages {
  static readonly type = '[Whatsapp] Subscribe to messages';
  constructor(public id: number) {}
}

export class SubscribeToReadStatus {
  static readonly type = '[Whatsapp] Subscribe to read status';
  constructor(public id: number) {}
}

export class SubscribeToConctactRequests {
  static readonly type = '[Whatsapp] Subscribe to contact requests';
  constructor(public id: number) {}
}

export class SelectContact {
  static readonly type = '[Whatsapp] Select contact';
  constructor(public selectedContact: WhatsappContact) {}
}

export class AddMessages {
  static readonly type = '[Whatsapp] Add messages';
  constructor(public messages: Map<number, WhatsappMessage[]>) {}
}

export class AddMessage {
  static readonly type = '[Whatsapp] Add message';
  constructor(public message: WhatsappMessage) {}
}

export class UpdateReadStatus {
  static readonly type = '[Whatsapp] Update read status';
  constructor(public messages: WhatsappMessage[]) {}
}

export class UpdateContacts {
  static readonly type = '[Whatsapp] Update contacts';
  constructor(public contacts: WhatsappContact[]) {}
}

export class ResetWhatsappState {
  static readonly type = '[Whatsapp] Reset state';
}
