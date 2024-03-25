const commentTypeDef = `#graphql

type Comment {
    id: ID!
    content: String!
    postId: String!
    userId: String!
    likes: [String!]
    numberOfLikes: Int
    post:Post!
}

type Query {
    allComments(postId: String!): [Comment!]!
}

type Mutation {
    createComment(postId: ID!, content: String!): CreateCommentResponse!
    deleteComment(id: ID!): DeleteCommentResponse!
    likeComment(commentId: ID!): LikeCommentResponse!
    updateComment(commentId: ID!, updatedContent: String!): UpdateCommentResponse!
}

type CreateCommentResponse {
    success: Boolean!
    message: String!
    id: ID
    postId: ID
    userId: ID
    content: String
}

type DeleteCommentResponse {
    success: Boolean!
    message: String!
    id: ID
}

type LikeCommentResponse {
    success: Boolean!
    message: String!
    id: ID
    liked: Boolean
    numberOfLikes: Int
}

type UpdateCommentResponse {
    success: Boolean!
    message: String!
    id: ID
    content: String
}
`;

export default commentTypeDef;
