import express from 'express';
const app = express();

app.get('/test-async', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  throw new Error('Error in Database Connection');
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
