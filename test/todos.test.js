const request = require('supertest');
const app = require('../src/index');

describe('Todos API (integration)', () => {
  test('GET / returns API message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  let created;

  test('POST /todos creates a todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 'Write tests' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'Write tests');
    created = res.body;
  });

  test('GET /todos returns created todo', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(t => t.id === created.id)).toBeTruthy();
  });

  test('GET /todos/:id returns the todo', async () => {
    const res = await request(app).get(`/todos/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', created.id);
  });

  test('PUT /todos/:id updates the todo', async () => {
    const res = await request(app)
      .put(`/todos/${created.id}`)
      .send({ title: 'Write better tests', completed: true });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Write better tests');
    expect(res.body).toHaveProperty('completed', true);
  });

  test('DELETE /todos/:id removes the todo', async () => {
    const res = await request(app).delete(`/todos/${created.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', created.id);
  });

  test('GET /todos/:id returns 404 after deletion', async () => {
    const res = await request(app).get(`/todos/${created.id}`);
    expect(res.status).toBe(404);
  });
});
