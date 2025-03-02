const { Router } = require("express");
const {adminModel, courseModel} = require('../db');
const {z} = require('zod');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

adminRouter.post("/course", async(req, res) => {
  const adminId = req.userId;
  const {title,description,price,imageURL,creatorid} = req.body;
  const course = await courseModel.create({
    title: title,
    description: description,
    price: price,
    imageURL: imageURL,
    creatorid: adminId
  })
  res.json({
    message: "course created successfully",
    courseId: course._id
  })
});

adminRouter.put("/", (req, res) => {
  res.json({
    message: "Hello from removecourse admin"
  });
});

adminRouter.get("/bulk", (req, res) => {
  res.json({
    message: "Hello from singup admin"
  });
});


module.exports={
  adminRouter,
}

