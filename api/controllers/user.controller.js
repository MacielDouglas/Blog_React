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
  try {
    const { isAdmin } = req.user;
    const { userId } = req.params;

    if (!isAdmin && userId !== req.user.id) {
      return next(
        errorHandler(403, "Você não tem permissão para excluir este usuário.")
      );
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json("Usuário deletado com sucesso!!!");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("O usuário foi desconectado.");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return next(
        errorHandler(403, "Você não tem permissão para ver todos os usuários")
      );
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

    // Validar entradas
    if (isNaN(startIndex) || isNaN(limit)) {
      return next(
        errorHandler(
          400,
          "startIndex e limit devem ser números inteiros válidos."
        )
      );
    }

    // Consultar usuários
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .lean();

    // Remover a senha dos usuários
    const userWithoutPassword = users.map(({ password, ...rest }) => rest);

    // Contagem total de usuários
    const totalUsers = await User.countDocuments();

    // Contagem de usuários do último mês
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Retornar resposta
    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
