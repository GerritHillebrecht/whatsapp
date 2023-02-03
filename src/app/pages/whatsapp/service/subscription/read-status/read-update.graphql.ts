import {
  UserFragment,
  MessageFragment,
  WhatsappMessageQueryDto,
} from '@whatsapp/interface';
import { gql } from 'apollo-angular';

export const READ_UPDATE_SUBSCRIPTION = gql`
  ${MessageFragment}
  ${UserFragment}

  subscription StatusUpdateSubscription($id: Float!) {
    readupdateSubscription(receiverId: $id) {
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

export interface StatusUpdateSubResult {
  __typename: string;
  messageStatusSubscription: WhatsappMessageQueryDto;
}

export interface StatusUpdateSubVariables {
  id: number;
}
