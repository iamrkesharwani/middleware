import express from 'express';
const app = express();

app.use('/assets', express.static('public'));

app.post('/user-json', express.json(), (req, res) => {
  res.json({ message: 'JSON Parser', data: req.body || {} });
});

app.post('/user-form', express.urlencoded({ extended: true }), (req, res) => {
  res.json({ message: 'Form data received', data: req.body || {} });
});

app.listen(3000, () => console.log('Server started on port 3000'));
