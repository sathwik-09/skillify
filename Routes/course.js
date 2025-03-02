const { Router } = require('express');

const courseRouter = Router();

courseRouter.post('/purchase', (req, res) => {
  res.json({
    message: 'What do you want to purchase!'});
});

courseRouter.get('/purchases', (req, res) => {
  res.json({
    message: 'What do you want to purchase!'});
});

module.exports = {
  courseRouter: courseRouter,
};
