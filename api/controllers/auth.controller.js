import { errorHandler } from "../utils/error.js";
import User from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verificar campos obrigatórios
    if (!email || !password) {
      return next(errorHandler(400, "Todos os campos são necessários."));
    }

    // Buscar usuário no banco de dados
    const user = await User.findOne({ email }).select("+password");

    // Verificar se o usuário existe
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return next(errorHandler(401, "Credenciais inválidas."));
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    // Responder com o token e os dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user._doc;
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    // Verifica se o usuário já existe no banco de dados
    let user = await User.findOne({ email });

    if (!user) {
      // Se o usuário não existir, gera uma senha aleatória
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // Hash da senha gerada
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      // Cria um novo usuário com os dados do Google
      user = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // Salva o novo usuário no banco de dados
      await user.save();
    }

    // Gera um token de autenticação usando o ID do usuário
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    // Remove a senha do usuário da resposta
    const { password, ...rest } = user._doc;

    // Define o token como cookie e envia os dados do usuário (exceto a senha)
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    // Trata erros, se houver
    next(error);
  }
};
