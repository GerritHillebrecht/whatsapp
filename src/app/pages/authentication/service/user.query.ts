import { gql } from "apollo-angular";

export const userQuery = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      image
      createdAt
      updatedAt
    }
  }
`;
