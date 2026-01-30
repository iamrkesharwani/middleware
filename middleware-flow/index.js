import express from 'express';
const app = express();

const timeStamper = (req, res, next) => {
  console.log('1. Adding timestamp...');
  req.entryTime = new Date().toISOString();
  next();
};

const securityCheck = (req, res, next) => {
  console.log('2. Checking password...');
  const password = req.query.pass;
  if (password === 'secret') {
    next();
  } else {
    res.status(401).send('Security Alert: Wrong Password!');
  }
};

app.use(timeStamper);
app.use(securityCheck);

app.get('/dashboard', (req, res) => {
  console.log('Final destination reached!');
  res.send(`Welcome! You entered at ${req.entryTime}`);
});

app.listen(3000, () => console.log('Server is running on port 3000'));
