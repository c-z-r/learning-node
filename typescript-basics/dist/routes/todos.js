"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
let todos = [];
router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post("/todo", (req, res, next) => {
    const body = req.body;
    const newItem = {
        id: new Date().toISOString(),
        text: body.text
    };
    todos.push(newItem);
    res.status(201).json({ todos: todos });
});
router.put("/todo/:todoId", (req, res, next) => {
    const params = req.params;
    const body = req.body;
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
    const params = req.params;
    todos = todos.filter(item => item.id !== params.todoId);
    return res.status(200).json({ message: "Todo deleted!", todos: todos });
});
exports.default = router;
