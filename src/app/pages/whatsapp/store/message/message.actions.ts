import {
  WhatsappMessage,
  WhatsappMessageQueryDto,
  WhatsappUser,
} from '@whatsapp/interface';

export class FetchMessages {
  static readonly type = '[Whatsapp Message] Fetch messages';
  constructor(public id: number) {}
}

export class SetMessages {
  static readonly type = '[Whatsapp Message] Set messages';
  constructor(public messages: WhatsappMessage[]) {}
}

export class AddWhatsappMessage {
  static readonly type = '[Whatsapp Message] Add message';
  constructor(public message: WhatsappMessage) {}
}

export class UpdateReadStatus {
  static readonly type = '[Whatsapp Message] Update read status';
  constructor(public ids: WhatsappMessageQueryDto['id'][]) {}
}

export class SendMessage {
  static readonly type = '[Whatsapp Message] Send message';
}

export class SubscribeToMessages {
  static readonly type = '[Whatsapp Message] Subscribe to messages';
  constructor(public id: number) {}
}

export class SubscribeToReadUpdates {
  static readonly type = '[Whatsapp Message] Subscribe to read updates';
  constructor(public id: number) {}
}

export class SetMessageLoadingState {
  static readonly type = '[Whatsapp Message] Set loading state';
  constructor(public loadingState: boolean) {}
}

export class ResetWhatsappMessageState {
  static readonly type = '[Whatsapp Message] Reset state';
}
