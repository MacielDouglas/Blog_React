import Post from "../../models/post.models.js";
import slugify from "slugify";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../utils/verifyToken.js";
import Comment from "../../models/comment.model.js";

const postResolver = {
  Query: {
    allPosts: async () => {
      try {
        const posts = await Post.find().exec();
        return posts;
      } catch (error) {
        throw new Error(`Erro ao buscar todos os posts: ${error.message}`);
      }
    },
    onePost: async (_, { slug }) => {
      try {
        const post = await Post.findOne({ slug }).exec();
        if (!post) {
          throw new Error("Post não encontrado.");
        }
        return post;
      } catch (error) {
        throw new Error(`Erro ao buscar o post: ${error.message}`);
      }
    },
    filterPost: async (_, { input }) => {
      try {
        let filters = {}; // Inicializa um objeto vazio para os filtros
        console.log(input);
        // Verifica se há filtros de título e categoria fornecidos
        if (input.filter) {
          if (input.filter.title) {
            // Adiciona filtro de título apenas se estiver presente
            filters.title = { $regex: new RegExp(input.filter.title, "i") };
          }
          if (input.filter.category) {
            // Adiciona filtro de categoria apenas se estiver presente
            filters.category = input.filter.category;
          }
        }

        // Executa a consulta com os filtros
        const posts = await Post.find(filters).exec();

        return posts;
      } catch (error) {
        console.error("Erro ao filtrar posts:", error.message);
        throw new Error(
          "Erro ao filtrar posts. Por favor, tente novamente mais tarde."
        );
      }
    },
  },

  Mutation: {
    createPost: async (_, { newPost }, { req }) => {
      const userId = verifyToken(req.headers.authorization).userId;

      try {
        // Verificar se o usuário está autenticado
        if (!userId) {
          throw new Error(
            "Usuário não autenticado. Faça login para continuar."
          );
        }
        // Verificar se o título já está em uso
        const existingPost = await Post.findOne({ title: newPost.title });
        if (existingPost) {
          throw new Error("Já existe um post com este título.");
        }
        // Criar um slug único
        const slug = slugify(newPost.title, { lower: true });
        // Criar o novo post associado ao usuário
        const postNew = new Post({
          ...newPost,
          userId,
          slug: slug,
        });
        // Salvar o novo post
        await postNew.save();
        return postNew;
      } catch (error) {
        throw new Error(`Erro ao criar o post: ${error.message}`);
      }
    },

    deletePost: async (_, { postId }, { req }) => {
      const userId = verifyToken(req.headers.authorization).userId;

      try {
        if (!userId) {
          throw new Error(
            "Usuário não autenticado. Faça login para continuar."
          );
        }

        // Verificar se o post existe
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("Post não encontrado.");
        }

        // Verificar se o usuário é o proprietário do post
        if (post.userId !== userId) {
          throw new Error(
            "Você não tem autorização para excluir essa postagem."
          );
        }

        // Deletar o post
        await Post.findByIdAndDelete(postId);

        return {
          success: true,
          message: "A postagem foi removida com sucesso.",
        };
      } catch (error) {
        throw new Error(`Erro ao deletar o post: ${error.message}`);
      }
    },

    updatePost: async (_, { id, updatedPost }, { req }) => {
      const userId = verifyToken(req.headers.authorization).userId;

      try {
        if (!userId) {
          throw new Error(
            "Usuário não autenticado. Faça login para continuar."
          );
        }
        // Verificar se o post existe
        console.log(id);
        const post = await Post.findById(id);
        console.log(post);
        if (!post) {
          throw new Error("Post não encontrado.");
        }
        // Verificar se o usuário é o proprietário do post
        if (post.userId !== userId) {
          throw new Error(
            "Você não tem autorização para alterar essa postagem."
          );
        }
        const newSlug = slugify(updatedPost.title, { lower: true });

        Object.assign(post, {
          ...updatedPost,
          slug: newSlug,
        });

        await post.save();

        return {
          success: true,
          message: "Post atualizado com sucesso.",
          title: post.title,
          content: post.content,
          image: post.image,
          category: post.category,
          id: post.id,
        };
      } catch (error) {
        throw new Error(`Erro ao atualizar postagem: ${error.message}`);
      }
    },
  },

  Post: {
    comment: async (parent) => {
      try {
        const postId = parent.id;
        const comments = await Comment.find({ postId }).exec();
        return comments;
      } catch (error) {
        console.error("Erro ao trazer comentários de uma postagem.");
        throw new Error(error.message || "Erro interno no servidor");
      }
    },
  },
};

export default postResolver;
