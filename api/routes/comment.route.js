import express from "express";
import { verifyToken } from "./../utils/verifyUser.js";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

/**
 * Rota para criar um novo comentário.
 * Requer autenticação do usuário.
 * POST /api/comments/create
 */
router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);

export default router;
