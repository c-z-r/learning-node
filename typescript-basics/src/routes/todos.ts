import { Router } from "express";

const router = Router();

import { Todo } from "../models/todo";

type RequestBody = { text: string };
type RequestParams = { todoId: string };

let todos: Array<Todo> = [];
router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as { text: string };
  const newItem: Todo = {
    id: new Date().toISOString(),
    text: body.text
  };
  todos.push(newItem);

  res.status(201).json({ todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;

  const body = req.body as RequestBody;

  const index = todos.findIndex(item => item.id === params.todoId);
  if (index >= 0) {
    todos[index] = {
      id: todos[index].id,
      text: body.text
    };
    return res.status(200).json({ message: "Todo updated!", todos: todos });
  }
  res.status(404).json({ message: "No todo with this id :(" });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  todos = todos.filter(item => item.id !== params.todoId);
  return res.status(200).json({ message: "Todo deleted!", todos: todos });
});

export default router;
