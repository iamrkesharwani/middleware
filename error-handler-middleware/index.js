import express from 'express';
const app = express();

app.get('/register', (req, res, next) => {
  const { username } = req.query;
  if (!username) {
    const err = new Error('Username is required');
    err.status = 400;
    return next(err);
  }
  res.send('User registered');
});

app.get('/secret', (req, res, next) => {
  const err = new Error('Unauthorized access');
  err.status = 401;
  return next(err);
});

app.get((req, res, next) => {
  const err = new Error('Resource not found');
  err.status = 404;
  return next(err);
});

app.use((err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.url} - Error: ${err.message}`
  );

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    errorType: statusCode === 500 ? 'Server Error' : 'Client Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
