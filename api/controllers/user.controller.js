import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

// Rota de teste para verificar se a rota está funcionando
export const test = (req, res) =>
  res.send({ message: "Rota funcionando plenamente." });

// Função para atualizar informações do usuário
export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { id: loggedInUserId } = req.user;

  // Verifica se o usuário autenticado é o mesmo que está sendo atualizado
  if (loggedInUserId !== userId) {
    return next(
      errorHandler(403, "Você não tem permissão para atualizar este usuário")
    );
  }

  try {
    // Verifica e atualiza a senha, se fornecida
    if (req.body.password) {
      const { password } = req.body;
      if (password.length < 6) {
        return next(
          errorHandler(400, "A senha deve ter pelo menos 6 caracteres")
        );
      }
      req.body.password = bcryptjs.hashSync(password, 10);
    }

    // Verifica e valida o nome de usuário, se fornecido
    if (req.body.username) {
      const { username } = req.body;
      if (username.length < 7 || username.length > 20) {
        return next(
          errorHandler(
            400,
            "O nome de usuário deve ter entre 7 e 20 caracteres"
          )
        );
      }
      if (/\s/.test(username)) {
        return next(
          errorHandler(400, "O nome de usuário não pode conter espaços.")
        );
      }
      if (username !== username.toLowerCase()) {
        return next(
          errorHandler(
            400,
            "O nome de usuário deve estar em letras minúsculas."
          )
        );
      }
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return next(
          errorHandler(400, "O nome de usuário só pode conter letras e números")
        );
      }
    }

    // Atualiza as informações do usuário no banco de dados
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );

    // Remove a senha do objeto de usuário retornado
    const { password: userPassword, ...rest } = updatedUser._doc;

    // Retorna os detalhes do usuário atualizados
    res.status(200).json(rest);
  } catch (error) {
    next(error); // Encaminha o erro para o middleware de tratamento de erro
  }
};

// Função para excluir um usuário
export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const { id: loggedInUserId } = req.user;

  // Verifica se o usuário autenticado é o mesmo que está sendo excluído
  if (loggedInUserId !== userId) {
    return next(
      errorHandler(403, "Você não tem permissão para excluir este usuário.")
    );
  }

  try {
    // Exclui o usuário do banco de dados
    await User.findByIdAndDelete(userId);
    res.status(200).json("Usuário deletado com sucesso.");
  } catch (error) {
    next(error);
  }
};
