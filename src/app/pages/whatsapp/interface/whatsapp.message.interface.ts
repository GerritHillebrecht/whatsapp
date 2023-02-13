import {
  ImageSizes,
  ImageType,
} from '@whatsapp/service/storage/storage.service';
import { gql } from 'apollo-angular';
import { WhatsappUser } from './whatsapp.user.interface';

export interface WhatsappMessageDto {
  __typename?: 'Message';
  id: number;
  uuid: string;
  body: string;
  sender: WhatsappUser;
  receiver: WhatsappUser;
  image: string | null;
  deliveryStatus: WhatsappMessageDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageImage = {
  filename: string;
  size: ImageSizes;
  type: ImageType;
};

export interface WhatsappMessage extends WhatsappMessageDto {
  isMine: boolean;
}

export type WhatsappMessageDeliveryStatus = 'pending' | 'delivered' | 'read';

export const MessageFragment = gql`
  fragment MessageFragment on Message {
    id
    uuid
    body
    image
    deliveryStatus
    createdAt
    updatedAt
  }
`;
