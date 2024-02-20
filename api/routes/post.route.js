import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";

// Cria um novo roteador Express
const router = express.Router();

// Rota para criar uma nova postagem, verifica o token de autenticação antes de prosseguir
router.post("/create", verifyToken, create);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postID/:userId", verifyToken, deletePost);
router.put("/updatepost/:postId/:userId", verifyToken, updatePost);

export default router;
