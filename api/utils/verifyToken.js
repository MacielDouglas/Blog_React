import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  //   const token = req.headers.authorization;

  let userId = null;
  let isAdmin = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      isAdmin = decoded.isAdmin;
    } catch (error) {
      console.log("Erro ao verificar o token:", error.message);
    }
  }
  return { userId, isAdmin };
};
