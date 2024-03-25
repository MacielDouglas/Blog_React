const postTypeDef = `#graphql

type Post {
    id: ID!
    userId: ID!
    title: String!
    content: String!
    image: String!
    category: String!
    slug: String
    createdAt: String
    comment: [Comment!]
}

type Query {
    allPosts: [Post!]!
    onePost(slug: String!): Post
    filterPost(input: PostsInput!): [Post!]!
}

type Mutation {
    createPost(newPost: NewPostInput!): Post
    deletePost(postId: ID!): DeletePostResponse
    updatePost(id: ID!,  updatedPost: UpdatePostInput!): UpdatePostResponse
}

input NewPostInput {
    userId: String!
    title: String!
    content: String!
    image: String!
    category: String!
}

type DeletePostResponse {
  success: Boolean!
  message: String
}

input UpdatePostInput {
    title: String
    content: String
    image: String
    category: String
    slug: String
}

type UpdatePostResponse {
    success: Boolean!
    message: String
    title: String
    content: String
    image: String
    category: String
    slug: String
}

input PostFilters {
  title: String
  category: String
}

input PostsInput {
  filter: PostFilters
}


`;

export default postTypeDef;
