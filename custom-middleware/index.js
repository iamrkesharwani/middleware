import express from 'express';
import crypto from 'node:crypto';
const app = express();

app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  res.set('Request-ID', req.id);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.id}] ${req.method} ${req.url} - ${duration}ms`);
  });

  next();
});

const bodySizeChecker = (req, res, next) => {
  const contentLength = req.headers['content-length'];
  const MAX_SIZE = 1024 * 1;

  if (contentLength && parseInt(contentLength) > MAX_SIZE) {
    return res.status(413).json({ error: 'Payload too large' });
  }
  next();
};

const authCheck = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token === 'admin-token') {
    req.user = { id: 101, role: 'admin' };
    next();
  } else if (token === 'user-token') {
    req.user = { id: 102, role: 'user' };
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admins only' });
  }
};

app.use(bodySizeChecker);
app.use(express.json());

app.get('/public', (req, res) => {
  res.send('Public message');
});

app.get('/admin/stats', authCheck, isAdmin, (req, res) => {
  res.json({
    message: 'Admin stats',
    requestId: req.id,
    user: req.user,
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
