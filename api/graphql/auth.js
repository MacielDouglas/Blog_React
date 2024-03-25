import { gql } from "apollo-server-express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // Importe o modelo do usuário do Mongoose ou outro ORM que você esteja usando

// Definição dos tipos de dados GraphQL para autenticação
export const authTypeDefs = gql`
  type AuthPayload {
    token: String!
    user: User!
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type Mutation {
    signIn(input: SignInInput!): AuthPayload
    # Defina outras mutações para signUp, signOut, etc., conforme necessário
  }
`;

// Resolvers para autenticação
export const authResolvers = {
  Mutation: {
    signIn: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Senha incorreta");
      }

      // Se as credenciais estiverem corretas, gera um token JWT e o retorna junto com os dados do usuário
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return {
        token,
        user,
      };
    },
    // Implemente resolvers para outras mutações de autenticação, como signUp, signOut, etc.
  },
};
