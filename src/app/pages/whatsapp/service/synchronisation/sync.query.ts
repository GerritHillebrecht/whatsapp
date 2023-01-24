import { MessageFragment } from '@whatsapp/interface/whatsapp.message.interface';
import { UserFragment } from '@whatsapp/interface/whatsapp.user.interface';
import { gql } from 'apollo-angular';
import { WhatsappMessageQueryDto, WhatsappUser } from '../../interface';

export const MARK_MESSAGES_AS_READ_MUTATION = gql`
  mutation MarkMessagesAsRead($messageIds: [Float!]!) {
    markMessagesAsRead(messageIds: $messageIds)
  }
`;

export const SUBSCRIPTION_QUERY = gql`
  ${MessageFragment}
  ${UserFragment}

  subscription MessageSubscription($id: Float!) {
    messageSubscription(receiverId: $id) {
      ...MessageFragment
      sender {
        ...UserFragment
      }
      receiver {
        ...UserFragment
      }
    }
  }
`;

export const STATUS_UPDATE_SUBSCRIPTION = gql`
  ${MessageFragment}
  ${UserFragment}

  subscription StatusUpdateSubscription($id: Float!) {
    statusUpdateSubscription(receiverId: $id) {
      ...MessageFragment
      sender {
        ...UserFragment
      }
      receiver {
        ...UserFragment
      }
    }
  }
`;

export const SYNCHRONIZATION_QUERY = gql`
  ${UserFragment}
  ${MessageFragment}

  query Sync($id: Float!) {
    contacts(id: $id) {
      ...UserFragment
    }

    messages(id: $id) {
      ...MessageFragment
      sender {
        ...UserFragment
      }
      receiver {
        ...UserFragment
      }
    }
  }
`;

export interface SyncQueryResult {
  __typename: string;
  messages: WhatsappMessageQueryDto[];
  contacts: WhatsappUser[];
}

export interface SyncQueryVariables {
  id: number;
}

export interface SubQueryResult {
  __typename: string;
  messageSubscription: WhatsappMessageQueryDto;
}

export interface SubQueryVariables {
  id: number;
}

export interface StatusUpdateSubResult {
  __typename: string;
  messageStatusSubscription: WhatsappMessageQueryDto;
}

export interface StatusUpdateSubVariables {
  id: number;
}
