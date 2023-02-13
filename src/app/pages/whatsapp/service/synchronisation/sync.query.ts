import { MessageFragment } from '@whatsapp/interface/whatsapp.message.interface';
import { UserFragment } from '@whatsapp/interface/whatsapp.user.interface';
import { gql, TypedDocumentNode } from 'apollo-angular';
import { WhatsappMessageQueryDto, WhatsappUser } from '../../interface';

export const MARK_MESSAGES_AS_READ_MUTATION = gql`
  mutation MarkMessagesAsRead($messageIds: [Float!]!) {
    markMessagesAsRead(messageIds: $messageIds)
  }
`;

export const MESSAGE_SUBSCRIPTION = gql`
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

export const MESSAGE_QUERY: TypedDocumentNode<
  MessageQueryResult,
  MessageQueryVariables
> = gql`
  ${UserFragment}
  ${MessageFragment}

  query Messages($id: Float!, $limit: Int!) {
    messages(id: $id, limit: $limit) {
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

export interface MessageQueryResult {
  __typename: string;
  messages: WhatsappMessageQueryDto[];
}

export interface MessageQueryVariables {
  id: number;
  limit: number;
}

export const CONTACT_QUERY = gql`
  ${UserFragment}

  query Contacts($id: Float!) {
    contacts(id: $id) {
      ...UserFragment
    }
  }
`;

export interface ContactQueryResult {
  __typename: string;
  contacts: WhatsappUser[];
}

export interface ContactQueryVariables {
  id: number;
}
