const { Router } = require('express');
const {userModel, purchaseModel, courseModel} = require('../db');
const {z} = require('zod');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userMiddleware } = require('../Middlewares/user');
const userRouter = Router();

userRouter.post('/signup', async(req, res) => {
  const requiredBody = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
  });
  const paresedBody = requiredBody.safeParse(req.body);

  if (!paresedBody.success) {
    return res.status(400).json({ message: "Incorrect Body" });
  }
  const { username, email, password } = paresedBody.data;
  const hashedPassword = await bcrypt.hash(password, 5);
  console.log(hashedPassword);
  try{
    await userModel.create({
      username: username,
      email: email,
      password: hashedPassword
    })
    res.json({
      message: "signup successful"
    })
  } catch(e){
    console.error("Error creating user:",e);
    res.status(500).json({
      message: "Internal server error"
    })
  }
});

userRouter.post('/signin', async(req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userModel.findOne({
    email: email,
  });
  if(!user){
    return res.status(403).json("User does not exist");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_USER_SECRET);
    console.log("JWT Secret:", process.env.JWT_USER_SECRET);
    res.json({token});
  } else {  
    return res.status(401).json("Invalid Credentials");
  }
});

userRouter.get('/purchases', userMiddleware, async(req, res) => {  
  const userId = req.userId;
  const purchases = await purchaseModel.find({
    userId
  })
  const purchasedCourseIds = [];
  for(let i=0; i<purchases.length; i++){
    purchasedCourseIds.push(purchases[i].courseId)
  }
  const purchasedData = await courseModel.find({
    _id: {$in : purchasedCourseIds}
  })

  res.json({
    purchases,
    purchasedData
  })
});

module.exports = {
  userRouter: userRouter,
};  