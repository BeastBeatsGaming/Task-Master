import express from "express";
import {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";
import { protect } from "../middleware/authMiddleware"; // Import protect middleware

const router = express.Router();

// Protect all todo routes
router.use(protect); // Apply protect middleware to all routes in this router

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").get(getTodoById).put(updateTodo).delete(deleteTodo);

export default router;
