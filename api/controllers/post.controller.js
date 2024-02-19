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
