import { WhatsappMessageQueryDto } from '@whatsapp/interface';
import { gql } from 'apollo-angular';

export const MESSAGE_QUERY = gql`
  query Messages($id: Float!) {
    messages(id: $id) {
      id
      body
      isRead
      deliveryStatus
      sender {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      receiver {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGE_CREATE_MUTATION = gql`
  mutation SaveMessage($body: String!, $receiverId: Float!, $senderId: Float!) {
    saveMessage(body: $body, receiverId: $receiverId, senderId: $senderId) {
      id
      body
      isRead
      image
      deliveryStatus
      sender {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      receiver {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGE_UPDATE_MUTATION = gql`
  mutation UpdateMessage($id: Float!, $body: String!) {
    updateMessage(id: $id, body: $body) {
      id
      body
      isRead
      sender {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      receiver {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGE_DELETE_MUTATION = gql`
  mutation DeleteMessage($id: Float!) {
    deleteMessage(id: $id) {
      id
      body
      isRead
      sender {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      receiver {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

export interface MessageQueryResult {
  __typename: string;
  messages: WhatsappMessageQueryDto[];
}

export interface MessageQueryVariables {
  id: number;
}

export interface MessageCreateResult {
  __typename: string;
  saveMessage: WhatsappMessageQueryDto;
}

export interface MessageCreateVariables {
  body: string;
}

export interface MessageUpdateResult {
  __typename: string;
  updateMessage: WhatsappMessageQueryDto;
}

export interface MessageUpdateVariables {
  id: number;
  body: string;
}

export interface MessageDeleteResult {
  __typename: string;
  deleteMessage: WhatsappMessageQueryDto;
}

export interface MessageDeleteVariables {
  id: number;
}
