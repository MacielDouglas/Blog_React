import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * Rota para criar um novo comentário.
 * Requer autenticação do usuário.
 * POST /api/comments/create
 */
router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);

export default router;
