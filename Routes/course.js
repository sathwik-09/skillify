const { Router } = require('express');
const { userMiddleware } = require('../Middlewares/user');
const { purchaseModel, courseModel } = require('../db');

const courseRouter = Router();

courseRouter.post('/purchase', userMiddleware, async(req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;
  await purchaseModel.create({
    userId,
    courseId
  })
  res.json({
    message: "Successfully purchased the course"
  })

});

courseRouter.get('/preview', async(req, res) => {
  const courses = await courseModel.find({});
  res.json({
    courses
  })
});

module.exports = {
  courseRouter: courseRouter,
};
