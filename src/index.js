const express = require('express');
const todosRouter = require('./routes/todos');
const healthRouter = require('./routes/health');

const app = express();
app.use(express.json());

app.use('/todos', todosRouter);
app.get('/', (req, res) => res.json({ message: 'Express Demo Todos API' }));
app.use('/health', healthRouter);

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly.
if (require.main === module) {
	app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

module.exports = app;
