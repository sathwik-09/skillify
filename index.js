const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const app = express();

const {userRouter} = require('./Routes/user');
const {courseRouter} = require('./Routes/course');
const {adminRouter} = require('./Routes/admin')

app.use(express.json());



app.use('/api/v1/user', userRouter);
app.use("/api/v1/admin", adminRouter)
app.use('/api/v1/course', courseRouter);

async function main(){
  await mongoose.connect(process.env.MONGODB_URL)
  app.listen(3000);
  console.log("connected to mongo db")
}
main();

