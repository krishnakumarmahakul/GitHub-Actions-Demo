# Express Demo — Todos API

This is a small demo Express application that provides a simple in-memory "todos" API and a healthcheck.

Endpoints
- GET / - small welcome message
- GET /health - service health and uptime
- GET /todos - list todos
- POST /todos - create todo { title, completed }
- GET /todos/:id - get todo by id
- PUT /todos/:id - update todo (title and/or completed)
- DELETE /todos/:id - remove todo

Run

1. Install dependencies

   npm install

2. Start server

   npm start

3. Example

Create a todo:

```bash
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```

Check health:

```bash
curl http://localhost:3000/health
```
