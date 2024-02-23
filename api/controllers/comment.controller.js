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
