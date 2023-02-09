import { gql } from 'apollo-angular';

export interface WhatsappUser {
  __typename?: 'User';
  id: number;
  email: string;

  firstName: string;
  lastName: string;
  image?: string | null;
  isBot: boolean;

  contacts: WhatsappUser[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    firstName
    lastName
    isBot
    email
    image
    createdAt
    updatedAt
  }
`;
