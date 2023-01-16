import { gql } from 'apollo-angular';
import { UserFragment } from '@whatsapp/interface';

export const userQuery = gql`
  ${UserFragment}

  query User($id: String!) {
    user(id: $id) {
      ...UserFragment
    }
  }
`;
