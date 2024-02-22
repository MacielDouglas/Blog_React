import mongoose from "mongoose";

// Definindo constantes para valores padrão
const DEFAULT_LIKES = [];
const DEFAULT_NUMBER_OF_LIKES = 0;

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      // Descrição do campo: Conteúdo do comentário
    },
    postId: {
      type: String,
      required: true,
      // Descrição do campo: ID da postagem relacionada
    },
    userId: {
      type: String,
      required: true,
      // Descrição do campo: ID do usuário que fez o comentário
    },
    likes: {
      type: [String],
      default: DEFAULT_LIKES,
      // Descrição do campo: Lista de IDs de usuários que curtiram o comentário
    },
    numberOfLikes: {
      type: Number,
      default: DEFAULT_NUMBER_OF_LIKES,
      // Descrição do campo: Número de curtidas do comentário
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
