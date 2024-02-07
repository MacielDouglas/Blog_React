import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Middleware para verificar o token de acesso
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  // Verifica se o token está presente
  if (!token) {
    return next(errorHandler(401, "Não autorizado. Token não fornecido."));
  }

  // Verifica a validade do token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return next(errorHandler(401, "Não autorizado. Token inválido."));
    }

    // Adiciona o usuário decodificado ao objeto de solicitação para uso posterior
    req.user = decodedToken;
    next();
  });
};
