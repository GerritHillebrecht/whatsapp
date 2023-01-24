import { gql } from 'apollo-angular';

export const READ_STATUS_UPDATE_MUTATION = gql`
  mutation UpdateReadStatus($ids: [Int!]!) {
    updateReadStatus(messageIds: $ids)
  }
`;

export interface ReadStatusUpdateResult {
  __typename: string;
  updateReadStatus: number[];
}

export interface ReadStatusUpdateVariables {
  ids: number[];
}
