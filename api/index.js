import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configurar middleware para lidar com CORS
app.use(cors());

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err.message));

// Rota de exemplo
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use(express.json());
// Roteamento de usuário
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
