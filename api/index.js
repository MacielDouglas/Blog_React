import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configurações
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do Servidor.";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Inicialização
const startServer = async () => {
  console.log("Conectando ao Mongo...");
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Conectado ao MongoDB com sucesso!!!");
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err.message);
  }
};

startServer();
