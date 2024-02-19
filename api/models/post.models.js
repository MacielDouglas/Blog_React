import mongoose from "mongoose";

// Definição do esquema do modelo de postagem
const postSchema = new mongoose.Schema(
  {
    // Identificador do usuário que criou a postagem
    userId: {
      type: String,
      required: true,
    },
    // Conteúdo da postagem
    content: {
      type: String,
      required: true,
    },
    // Título da postagem (deve ser único)
    title: {
      type: String,
      required: true,
      unique: true,
    },
    // URL da imagem da postagem (padrão: imagem genérica)
    image: {
      type: String,
      default: generateDefaultImageURL, // Utiliza uma função para gerar a URL padrão
    },
    // Categoria da postagem (padrão: não categorizada)
    category: {
      type: String,
      default: "uncategorized",
    },
    // Slug da postagem (deve ser único)
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } // Adiciona campos de data de criação e atualização automáticos
);

// Método para gerar a URL padrão da imagem
function generateDefaultImageURL() {
  return "https://www.monsterinsights.com/wp-content/uploads/2020/01/what-is-the-best-time-to-post-a-blog-and-how-to-test-it-1250x600.jpg.webp";
}

// Cria o modelo de Post com o esquema definido
const Post = mongoose.model("Post", postSchema);

export default Post;
