import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import dotenv from "dotenv";
import mergedTypeDefs from "./graphql/typeDefs/index.js";
import mergedResolvers from "./graphql/resolvers/index.js";
import User from "./models/user.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGO_DB;
console.log("Conectando... ao MongoDB");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado ao MongoDB");
  })
  .catch((error) => {
    console.log("Erro de conexão com MongoDB: ", error.message);
  });

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const schema = makeExecutableSchema({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
  });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors({
      origin: "http://localhost:3000", // Substitua pela origem real do seu cliente
      credentials: true, // Permitir o envio de cookies de autenticação
    }),
    express.json(),
    expressMiddleware(server, {
      context: ({ req, res }) => ({ req, res }),
    })
  );

  const PORT = 8000;

  httpServer.listen(PORT, () =>
    console.log(`Servidor rodando em http://localhost:${PORT}`)
  );
};

start();

// context: ({ req, res }) => {
//   // Extrair o token do cabeçalho da solicitação
//   const token = req.headers.authorization || "";
//   // Verificar se o token está presente e decodificar
//   let userId = null;
//   let isAdmin = null;
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       userId = decoded.userId;
//       isAdmin = decoded.isAdmin;
//     } catch (error) {
//       console.log("Erro ao verificar o token:", error.message);
//     }
//   }

//   // Retornar o contexto com o token do usuário
//   return { userId };

// start();

// import { ApolloServer } from "@apollo/server";
// import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
// import { execute, subscribe } from "graphql";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import http from "http";
// import express from "express";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import mergedTypeDefs from "./graphql/typeDefs/index.js";
// import mergedResolvers from "./graphql/resolvers/index.js";
// import User from "./models/user.model.js";
// import { SubscriptionServer } from "subscriptions-transport-ws";

// dotenv.config();

// const MONGODB_URI = process.env.MONGO_DB;

// mongoose
//   .connect(MONGODB_URI)
//   .then(() => {
//     console.log("Conectado ao MongoDB");
//   })
//   .catch((error) => {
//     console.log("Erro de conexão com MongoDB: ", error.message);
//     process.exit(1);
//   });

// const app = express();
// const httpServer = http.createServer(app);

// const schema = makeExecutableSchema({
//   typeDefs: mergedTypeDefs,
//   resolvers: mergedResolvers,
// });

// const server = new ApolloServer({
//   schema,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   context: async ({ req }) => {
//     const auth = req ? req.headers.authorization : null;
//     if (auth && auth.startsWith("Bearer")) {
//       try {
//         const decodedToken = jwt.verify(
//           auth.substring(7),
//           process.env.JWT_SECRET
//         );
//         const currentUser = await User.findById(decodedToken.id);
//         return { currentUser };
//       } catch (error) {
//         console.error("Erro ao verificar token JWT:", error.message);
//       }
//     }
//   },
//   app,
// });

// httpServer.listen({ port: 8000 }, async () => {
//   await server.start();
//   console.log(`Servidor HTTP e WebSocket rodando em http://localhost:8000`);

//   new SubscriptionServer(
//     {
//       execute,
//       subscribe,
//       schema,
//     },
//     {
//       server: httpServer,
//       path: "/graphql",
//     }
//   );
// });

// // Adicionar um manipulador de rota para a raiz ("/") que redireciona para o endpoint GraphQL ("/graphql")
// app.get("/", (req, res) => {
//   res.redirect("/graphql");
// });
