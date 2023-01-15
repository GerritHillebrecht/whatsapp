import { gql } from 'apollo-angular';

export const WhatsappUserFragments = {
  user: gql`
    fragment UserFragment on User {
      id
      email
      firstName
      lastName
      image
      contacts {
        id
        email
        firstName
        lastName
        image
      }
      createdAt
      updatedAt
    }
  `,
  message: gql`
    fragment MessageFragment on Message {
      id
      text
      sender {
        id
        email
        firstName
        lastName
        image
      }
      receiver {
        id
        email
        firstName
        lastName
        image
      }
      isRead
      createdAt
      updatedAt
    }
  `,
};
