import { WhatsappMessage } from './whatsapp.message.interface';
import { WhatsappUser } from './whatsapp.user.interface';

export interface WhatsappContact extends WhatsappUser {
  // messages: WhatsappMessage[];
  lastMessage: WhatsappMessage | null;
  unreadMessages: number;
}
