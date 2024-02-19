import Post from "../models/post.models.js";
import { errorHandler } from "../utils/error.js";

// Função para criar uma nova postagem
export const create = async (req, res, next) => {
  // Verifica se o usuário é um administrador
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "Você não está autorizado a criar uma postagem.")
    );
  }

  // Verifica se os campos obrigatórios foram fornecidos
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Forneça todos os campos obrigatórios."));
  }

  // Cria um slug a partir do título da postagem
  const slug = req.body.title
    .toLowerCase()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/[^\w-]+/g, ""); // Remove caracteres especiais

  // Cria uma nova instância de Post com os dados fornecidos
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id, // Define o ID do usuário associado à postagem
  });

  try {
    // Salva a nova postagem no banco de dados
    const savedPost = await newPost.save();
    res.status(201).json(savedPost); // Retorna a postagem criada com sucesso
  } catch (error) {
    next(error); // Encaminha qualquer erro para o middleware de tratamento de erro
  }
};

export const getPosts = async (req, res, next) => {
  try {
    // Parse dos parâmetros de consulta
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // Construção da consulta com filtros opcionais
    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    // Consulta ao banco de dados
    const postsQuery = Post.find(query)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Contagem total de posts
    const totalPostsQuery = Post.countDocuments(query);

    // Contagem de posts do último mês
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPostsQuery = Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Execução das consultas em paralelo
    const [posts, totalPosts, lastMonthPosts] = await Promise.all([
      postsQuery.exec(),
      totalPostsQuery.exec(),
      lastMonthPostsQuery.exec(),
    ]);

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
