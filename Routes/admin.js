const { Router } = require("express");
const {adminModel, courseModel} = require('../db');
const {z} = require('zod');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {adminMiddleware} = require('../Middlewares/admin')

const adminRouter = Router();

adminRouter.post("/signup", async(req, res) => {
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
    await adminModel.create({
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

adminRouter.post("/signin", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const admin = await adminModel.findOne({
    email: email,
  });
  if(!admin){
    return res.status(403).json("User does not exist");
  }
  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (passwordMatch) {
    const token = jwt.sign({ id: admin._id.toString() }, process.env.JWT_ADMIN_SECRET);
    console.log("JWT Secret:", process.env.JWT_USER_SECRET);
    res.json({token});
  } else {  
    return res.status(401).json("Invalid Credentials");
  }
});

adminRouter.post("/course", adminMiddleware, async(req, res) => {
  const adminId = req.userId;
  const {title,description,price,imageURL} = req.body;
  const course = await courseModel.create({
    title: title,
    description: description,
    price: price,
    imageURL: imageURL,
  })
  res.json({
    message: "course created successfully",
    courseId: course._id
  })
});

adminRouter.put("/course", adminMiddleware, async(req, res) => {
  const adminId = req.userId;
  const {title,description,price,imageURL,courseId} = req.body;
  const course = await courseModel.updateOne({
    _id: courseId,
    creatorId: adminId
  },{
    title: title,
    description: description,
    price: price,
    imageURL: imageURL,
  })
  res.json({
    message: "course updated successfully",
    courseId: course._id
  })
});

adminRouter.get("/bulk",adminMiddleware, async(req, res) => {
  const adminId = req.userId;
  const courses = await courseModel.find({
    creatorId: adminId
  })
  res.json({
    message: "course fetched successfully",
    courses
  })
});

module.exports={
  adminRouter,
}

