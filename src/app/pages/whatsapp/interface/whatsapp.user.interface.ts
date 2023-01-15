import { gql } from 'apollo-angular';

export interface WhatsappUser {
  id: number;
  email: string;

  firstName: string;
  lastName: string;
  image?: string | null;

  contacts: WhatsappUser[];

  createdAt: Date;
  updatedAt: Date;
}

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    firstName
    lastName
    email
    image
    createdAt
    updatedAt
  }
`;
