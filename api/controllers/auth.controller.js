import { errorHandler } from "../utils/error.js";
import User from "./../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Verificar se há espaços em branco nos campos obrigatórios
  if (!username || !email || !password) {
    return next(errorHandler(400, "Todos os campos são obrigatórios."));
  }

  // Verificar espaços em branco no username, email e password
  if (/\s/.test(username) || /\s/.test(email) || /\s/.test(password)) {
    return next(
      errorHandler(400, "Os campos não podem conter espaços em branco.")
    );
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return res.json({ message: "Inscrito com sucesso!!!" });
  } catch (error) {
    return next(error);
  }
};
