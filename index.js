const express = require('express');
const app = express();

app.use(express.json());

app.get('/login', (req, res) => {
  res.send('Hello World!');
});

app.get('/register', (req, res) => {
  res.send('Hello World!');
});

app.get('puchase', (req, res) => {
  res.send('Hello World!');
});

app.get('mycourses', (req, res) => {  
  res.send('Hello World!');
});

app.listen(3000);