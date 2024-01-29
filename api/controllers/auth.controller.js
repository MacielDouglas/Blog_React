import User from "./../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  // Verificar se há espaços em branco nos campos obrigatórios
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios." });
  }

  // Verificar espaços em branco no username, email e password
  if (/\s/.test(username) || /\s/.test(email) || /\s/.test(password)) {
    return res
      .status(400)
      .json({ message: "Os campos não podem conter espaços em branco." });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Inscrito com sucesso!!!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar usuário.", error: error.message });
  }
};
