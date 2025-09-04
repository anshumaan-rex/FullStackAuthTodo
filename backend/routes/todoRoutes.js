import express from "express"
import { protect } from "../middlewares/authMiddleware.js"
import { createTodo, deleteTodo, getAllTodos, getSpecificTodo, updateTodo } from "../controllers/todoController.js"

const todoRouter = express.Router()

todoRouter.post("/create", protect, createTodo)
todoRouter.get("/all", protect, getAllTodos)
todoRouter.get("/search", protect, getSpecificTodo)
todoRouter.patch("/update/:id", protect, updateTodo)
todoRouter.delete("/delete/:id", protect, deleteTodo)

export default todoRouter



