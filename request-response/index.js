import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.get('/inspect/:category', (req, res) => {
  res.set('X-App-Name', 'ExpressApp');
  res.set('X-Request-Category', req.params.category);
  res.type('application/json');

  const clientData = {
    method: req.method,
    originalUrl: req.originalUrl,
    clientIp: req.ip,
    userAgent: req.get('User-Agent'),
    payload: req.body,
    headers: req.headers,
  };

  res.status(201).json({
    success: true,
    received: clientData,
  });
});

app.get('/view-doc', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'hello.txt');
  res.sendFile(filePath, (err) => {
    if (err) res.status(401).send('File not found for viewing.');
  });
});

app.get('/download-doc', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'hello.txt');
  res.download(filePath, 'downloaded-file.txt', (err) => {
    if (err && !res.headersSent)
      res.status(404).send('File not found for download.');
  });
});

app.listen(3000, () => console.log('Server active on port 3000'));
