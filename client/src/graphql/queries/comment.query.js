import { gql } from "@apollo/client";

export const ALL_COMMENTS = gql`
  query allComments($postId: String!) {
    allComments(postId: $postId) {
      id
      content
      likes
      numberOfLikes
      postId
      userId
    }
  }
`;
