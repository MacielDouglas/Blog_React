import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getPosts } from "../controllers/post.controller.js";

// Cria um novo roteador Express
const router = express.Router();

// Rota para criar uma nova postagem, verifica o token de autenticação antes de prosseguir
router.post("/create", verifyToken, create);
router.get("/getposts", getPosts);

export default router;
