import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.get('/api/data', (req, res) => {
  res.json({ data: 'Success' });
});

app.use((req, res, next) => {
  const err = new Error(
    `Resource Not Found: The path '${req.originalUrl}' does not exist on this server.`
  );
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
