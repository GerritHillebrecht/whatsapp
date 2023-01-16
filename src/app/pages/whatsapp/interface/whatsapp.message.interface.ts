import { gql } from 'apollo-angular';
import { WhatsappUser } from './whatsapp.user.interface';

export interface WhatsappMessageQueryDto {
  __typename?: 'Message';
  id: number;
  body: string;
  sender: WhatsappUser;
  receiver: WhatsappUser;
  isRead: boolean;
  image?: string | null;
  deliveryStatus: WhatsappMessageDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsappMessage extends WhatsappMessageQueryDto {
  isMine: boolean;
}

export type WhatsappMessageDeliveryStatus = 'pending' | 'delivered' | 'read';

export const MessageFragment = gql`
  fragment MessageFragment on Message {
    id
    body
    isRead
    image
    deliveryStatus
    createdAt
    updatedAt
  }
`;
