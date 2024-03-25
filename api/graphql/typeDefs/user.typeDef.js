const userTypeDef = `#graphql
# Definição do tipo de dados para um usuário
type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profilePicture: String!
    isAdmin: Boolean!
}

# Definição das consultas disponíveis
type Query {
    # Retorna uma lista de todos os usuários
    allUsers: [User!]!
    
    # Retorna um único usuário com base no ID fornecido
    oneUser(id: ID!): User
}

# Definição das mutações disponíveis
type Mutation {
    # Cria um novo usuário com base nos dados fornecidos
    createUser(user: NewUserInput!): User
    deleteUser(id: ID!): DeleteUserResponse
    updateUser(id: ID!, updatedUser: UpdateUserInput!): UpdateUserResponse
    loginUser(email: String!, password: String!): LoginResponse!
    logoutUser: LogoutResponse!
}

# Input para criação de um novo usuário
input NewUserInput {
    username: String!
    email: String!
    password: String!
    profilePicture: String
    isAdmin: Boolean
}

type DeleteUserResponse {
  success: Boolean!
  message: String
}

input UpdateUserInput {
  username: String
  email: String
  password: String
  profilePicture: String
  isAdmin: Boolean
}

type UpdateUserResponse {
  success: Boolean!
  message: String
  username: String
  email: String
  profilePicture: String
  isAdmin: Boolean
}

type LoginResponse {
  token: String!
  id: ID!
  username: String!
  email: String!
  profilePicture: String!
  isAdmin: Boolean!
}

type LogoutResponse {
  success: Boolean!
  message: String!
}

`;

export default userTypeDef;
