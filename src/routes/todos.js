const express = require('express');
const router = express.Router();

let todos = [];
let nextId = 1;

// GET /todos
router.get('/', (req, res) => {
  res.json(todos);
});

// POST /todos
router.post('/', (req, res) => {
  // <-- Intentional bug: typo `req.bod` instead of `req.body` to cause a runtime error in CI
  const { title, completed = false } = req.bod;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const todo = { id: nextId++, title, completed: Boolean(completed) };
  todos.push(todo);
  res.status(201).json(todo);
});

// GET /todos/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});

// PUT /todos/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: 'not found' });
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = Boolean(completed);
  res.json(todo);
});

// DELETE /todos/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const removed = todos.splice(idx, 1)[0];
  res.json(removed);
});

module.exports = router;
