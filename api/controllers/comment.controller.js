import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    // Desestruturação dos dados da requisição
    const { content, postId, userId } = req.body;
    const { id: requesterId } = req.user;

    // Verifica se o usuário logado é o mesmo que está tentando criar o comentário
    if (userId !== requesterId) {
      return next(
        errorHandler(403, "Você não tem permissão para criar este comentário.")
      );
    }

    // Cria um novo comentário
    const newComment = new Comment({ content, postId, userId });
    await newComment.save();

    // Retorna o novo comentário
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comentário não encontrado!"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comentário não encontrado"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "você não tem permissão para editar este comentário")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comentário não encontrado"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(
          403,
          "Você não tem permissão para deletar esse comentário."
        )
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comentário deletado!!!");
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    // Verifica se o usuário é um administrador
    if (!req.user.isAdmin) {
      throw new Error(
        "Você não tem permissão para receber todos os comentários"
      );
    }

    // Parâmetros de consulta para paginação e ordenação
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    // Consulta os comentários com a paginação e ordenação especificadas
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Conta o total de comentários
    const totalComments = await Comment.countDocuments();

    // Calcula o número de comentários do último mês
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Retorna os resultados como JSON
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    // Passa o erro para o próximo middleware de tratamento de erro
    next(error);
  }
};
