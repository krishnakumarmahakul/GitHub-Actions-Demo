
# Express Demo — Todos API

This is a small demo Express application that provides a simple in-memory "todos" API and a healthcheck.

## Endpoints
- GET / - small welcome message
- GET /health - service health and uptime
- GET /todos - list todos
- POST /todos - create todo { title, completed }
- GET /todos/:id - get todo by id
- PUT /todos/:id - update todo (title and/or completed)
- DELETE /todos/:id - remove todo

## Run (local)

1. Install dependencies

   ```powershell
   npm install
   ```

2. Start server

   ```powershell
   npm start
   ```

3. Example

Create a todo:

```bash
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```

Check health:

```bash
curl http://localhost:3000/health
```

---

## CI & Testing (beginner-friendly)

This project includes a simple CI pipeline (GitHub Actions) and automated tests using Jest + Supertest so you can learn how continuous integration tests an API.

### What is being tested?
- Behavioral correctness of your HTTP endpoints (status codes, JSON response shapes).
- That the endpoints continue to work as you change the code (regressions are caught by tests).

### Why Jest + Supertest?
- Jest is a test runner and assertion library. It finds tests, runs them, and reports results.
- Supertest lets you make HTTP requests directly to an Express `app` instance without opening a network port.

Together they provide simple, fast integration tests for Express APIs.

### Files to know
- `src/index.js` — creates and exports the Express `app`. Useful for importing in tests without starting an HTTP server.
- `src/routes/todos.js` — todos route handlers (GET, POST, PUT, DELETE).
- `src/routes/health.js` — a small health endpoint.
- `test/todos.test.js` — Jest tests that use Supertest to exercise the endpoints.
- `.github/workflows/github-actions-demo.yml` — GitHub Actions workflow that installs deps and runs tests on push/PR.

### How tests run locally (what to run)

```powershell
# install deps
npm install

# run tests (same command CI runs)

```

Running `npm test` executes Jest which loads files under `test/` and runs each test. Supertest imports `app` and issues requests against it.

### Example test pattern (what a test looks like)

1) Import the test helpers and app:

```javascript
const request = require('supertest');
const app = require('../src/index');
```

2) Make a request and assert:

```javascript
const res = await request(app).get('/');
expect(res.status).toBe(200);
expect(res.body).toHaveProperty('message');
```

This pattern is used in `test/todos.test.js` for each endpoint.

### How CI (GitHub Actions) runs the tests

1. You push or open a PR.
2. The workflow checks out the repository.
3. The workflow sets up Node.js on the runner.
4. It installs project dependencies (`npm ci`).
5. It runs `npm test` (which runs Jest + Supertest tests).
6. It uploads the Jest results (`jest-results.json`) as an artifact for inspection.

### Visual: How tests exercise routes

```mermaid
flowchart LR
  Tests[Jest tests] --> ST[Supertest requests]
  ST --> App[Express app (imported in tests)]
  App --> Routes[/todos routes]
  App --> Health[/health route]
  Routes --> Handlers[CRUD handlers]
  Handlers --> Response[JSON response]
  Response --> Assertions[expect(...)]
```

### Visual: CI flow

```mermaid
flowchart TD
  Dev[Developer] -->|push/PR| GitHub[GitHub repo]
  GitHub -->|trigger| Actions[GitHub Actions]
  Actions --> Runner[Hosted runner]
  Runner --> Checkout[actions/checkout]
  Runner --> SetupNode[actions/setup-node]
  Runner --> Install[Install dependencies (npm ci)]
  Runner --> Test[Run tests (npm test -> jest)]
  Test --> Results[jest-results.json]
  Results --> Upload[upload-artifact]
  Upload --> Dev
```

---

## Intentional learning errors in this repo

To help you see CI failures and stack traces, two intentional errors were added. They are there so you can push and watch the CI job fail and inspect logs/artifacts.

1) Failing assertion in tests
- File: `test/todos.test.js`
- Test name: `INTENTIONAL FAILURE to show CI error reporting`
- Problem: `expect(1).toBe(2);` — this assertion always fails and demonstrates a test failure.

2) Runtime typo in a route handler
- File: `src/routes/todos.js`
- Problematic line: `const { title, completed = false } = req.bod;` — the property name `req.bod` misses the final `y` and will throw when the POST handler runs.

Both of these are deliberate teaching aids. You can revert them as shown below.

### How to revert the intentional errors

- To remove the failing test, edit `test/todos.test.js` and remove or comment out the test block containing `INTENTIONAL FAILURE to show CI error reporting`.

- To fix the runtime typo, edit `src/routes/todos.js` and change:

```diff
-  const { title, completed = false } = req.bod;
+  const { title, completed = false } = req.body;
```

After reverting either or both, run `npm test` again.

---

## Troubleshooting CI failures

- Open the GitHub Actions run for the push/PR and inspect the `Run tests` step logs.
- Download the `jest-results` artifact from the run to see each test's results in JSON.
- For runtime exceptions, the stack trace will show the file and line number (e.g., `src/routes/todos.js:XX`).

## Next steps / improvements (suggestions)

- Add coverage: run `npm test -- --coverage` and upload the `coverage` directory as an artifact.
- Run tests on a Node.js matrix (e.g. 16, 18, 20) to ensure compatibility.
- Add tests for negative and edge cases (400, 404, invalid JSON, etc.).
- If you move to a database, add test setup/teardown to seed and clear the test DB.

---

If you'd like, I can:
- Remove the intentional errors to make the suite green again.
- Add coverage reporting to the workflow and upload the HTML report.
- Create a one-page printable cheat-sheet for teaching others — say the audience and I will tailor it.

Tell me which of those you'd like next and I will implement it.
