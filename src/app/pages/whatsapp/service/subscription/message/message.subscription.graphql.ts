import { MessageFragment, UserFragment, WhatsappMessageQueryDto } from '@whatsapp/interface';
import { gql } from 'apollo-angular';

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

export interface SubQueryResult {
  __typename: string;
  messageSubscription: WhatsappMessageQueryDto;
}

export interface SubQueryVariables {
  id: number;
}
