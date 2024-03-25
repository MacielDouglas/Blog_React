import { gql } from "@apollo/client";

export const NEW_USER = gql`
  mutation newUser($user: NewUserInput!) {
    createUser(user: $user) {
      id
      username
      email
      profilePicture
      isAdmin
      password
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      username
      email
      profilePicture
      isAdmin
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation Logout {
    logoutUser {
      message
      success
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
      success
      message
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($updateUserId: ID!, $updatedUser: UpdateUserInput!) {
    updateUser(id: $updateUserId, updatedUser: $updatedUser) {
      success
      message
      username
      email
      isAdmin
      profilePicture
    }
  }
`;
