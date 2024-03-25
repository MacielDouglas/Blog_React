import { gql } from "@apollo/client";

export const ALL_USERS = gql`
  query allUsers {
    allUsers {
      id
      username
      email
      isAdmin
      profilePicture
    }
  }
`;

export const ONE_USER = gql`
  query onUser($userId: ID!) {
    oneUser(id: $userId) {
      username
      email
      isAdmin
      profilePicture
    }
  }
`;
