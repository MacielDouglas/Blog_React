import { gql } from "@apollo/client";

export const ALL_POSTS = gql`
  query allPosts {
    allPosts {
      id
      title
      content
      image
      slug
      userId
      category
    }
  }
`;

export const ONE_POST = gql`
  query onePost($slug: String!) {
    onePost(slug: $slug) {
      id
      title
      content
      category
      image
      slug
      userId
      createdAt
      comment {
        content
        id
        likes
        numberOfLikes
      }
    }
  }
`;

export const FILTER_POST = gql`
  query FilterPost($input: PostsInput!) {
    filterPost(input: $input) {
      id
      title
      content
      category
      image
      slug
      userId
      createdAt
    }
  }
`;
