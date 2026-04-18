const express = require('express');
const dotenv = require('dotenv');
const taskRoutes = require('./route/task.route');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'Server is running.' });
});

app.use('/api/tasks', taskRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
