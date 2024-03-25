import Comment from "../../models/comment.model.js";
import Post from "../../models/post.models.js";
import User from "../../models/user.model.js";

const commentResolver = {
  Query: {
    allComments: async (_, { postId }) => {
      try {
        const comments = await Comment.find({ postId }).exec();
        return comments;
      } catch (error) {
        throw new Error("Erro ao buscar comentários.");
      }
    },
  },
  Mutation: {
    createComment: async (_, { postId, content }, { userId }) => {
      try {
        // Verificar se o usuário está logado
        if (!userId) {
          throw new Error(
            "Usuário não autenticado. Faça login para continuar."
          );
        }

        // Verificar se o postId é válido
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("ID do post inválido.");
        }

        // Criar um novo comentário
        const newComment = new Comment({
          postId,
          userId,
          content,
          likes: [], // Inicialmente, nenhum like
          numberOfLikes: 0, // Inicialmente, nenhum like
        });

        // Salvar o novo comentário no banco de dados
        await newComment.save();

        // Retornar a resposta indicando o sucesso da operação e os detalhes do novo comentário criado
        return {
          success: true,
          message: "Comentário criado com sucesso.",
          id: newComment.id,
          postId: newComment.postId,
          userId: newComment.userId,
          content: newComment.content,
        };
      } catch (error) {
        // Se houver algum erro durante a criação do comentário, lançar uma exceção
        throw new Error(`Erro ao criar o comentário: ${error.message}`);
      }
    },
    // createComment: async (_, { postId, content }, { userId }) => {
    //   try {
    //     // Verificar se o usuário está logado
    //     if (!userId) {
    //       throw new Error(
    //         "Usuário não autenticado. Faça login para continuar."
    //       );
    //     }

    //     // Verificar se o postId é válido
    //     const post = await Post.findById(postId);
    //     if (!post) {
    //       throw new Error("ID do post inválido.");
    //     }

    //     // Verificar se o userId é válido
    //     const user = await User.findById(userId);
    //     if (!user) {
    //       throw new Error("ID do usuário inválido.");
    //     }

    //     // Criar um novo comentário
    //     const newComment = new Comment({
    //       postId,
    //       userId,
    //       content,
    //       likes: [], // Inicialmente, nenhum like
    //       numberOfLikes: 0, // Inicialmente, nenhum like
    //     });

    //     // Salvar o novo comentário no banco de dados
    //     await newComment.save();

    //     // Retornar a resposta indicando o sucesso da operação e os detalhes do novo comentário criado
    //     return {
    //       success: true,
    //       message: "Comentário criado com sucesso.",
    //       id: newComment.id,
    //       postId: newComment.postId,
    //       userId: newComment.userId,
    //       content: newComment.content,
    //     };
    //   } catch (error) {
    //     // Se houver algum erro durante a criação do comentário, lançar uma exceção
    //     throw new Error(`Erro ao criar o comentário: ${error.message}`);
    //   }
    // },

    likeComment: async (_, { commentId }, { userId }) => {
      try {
        // Verificar se o usuário está autenticado
        if (!userId) {
          throw new Error(
            "Usuário não autenticado. Faça login para continuar."
          );
        }

        // Verificar se o comentário existe
        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        // Verificar se o usuário já deu like neste comentário
        const alreadyLiked = comment.likes.includes(userId);

        if (alreadyLiked) {
          // Se o usuário já deu like, remover o like e o id do usuário dos likes
          comment.likes = comment.likes.filter((like) => like !== userId);
          comment.numberOfLikes -= 1; // Reduzir o número de likes
          await comment.save();

          return {
            success: true,
            message: "Like removido com sucesso.",
            id: comment.id,
            liked: false,
            numberOfLikes: comment.numberOfLikes,
          };
        } else {
          // Se o usuário ainda não deu like, adicionar o like e o id do usuário aos likes
          comment.likes.push(userId);
          comment.numberOfLikes += 1; // Aumentar o número de likes
          await comment.save();

          return {
            success: true,
            message: "Like adicionado com sucesso.",
            id: comment.id,
            liked: true,
            numberOfLikes: comment.numberOfLikes,
          };
        }
      } catch (error) {
        throw new Error(`Erro ao dar like no comentário: ${error.message}`);
      }
    },
    updateComment: async (_, { commentId, updatedContent }, { userId }) => {
      try {
        // Verificar se o usuário está autenticado
        if (!userId) {
          throw new Error(
            "Usuário não autenticado. Faça login para continuar."
          );
        }

        // Verificar se o comentário existe
        const comment = await Comment.findById(commentId);
        if (!comment) {
          throw new Error("Comentário não encontrado.");
        }

        // Verificar se o usuário é o autor do comentário
        if (comment.userId !== userId) {
          throw new Error(
            "Você não tem permissão para editar este comentário."
          );
        }

        // Atualizar o conteúdo do comentário
        comment.content = updatedContent;
        await comment.save();

        return {
          success: true,
          message: "Comentário atualizado com sucesso.",
          id: comment.id,
          content: comment.content,
        };
      } catch (error) {
        throw new Error(`Erro ao atualizar o comentário: ${error.message}`);
      }
    },
  },
};

export default commentResolver;
