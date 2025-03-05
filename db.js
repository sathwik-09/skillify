const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  id: objectId
})

const adminSchema = new Schema({
  name: String,
  email: String,
  password: String,
  id: objectId
})

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageURL: String,
  createrid: objectId
})

const purchaseSchema = new Schema({
  userId: objectId,
  courseId: objectId
})

const userModel = mongoose.model('user', userSchema);
const adminModel = mongoose.model('admin', adminSchema);
const courseModel = mongoose.model('course', courseSchema);
const purchaseModel = mongoose.model('purchase', purchaseSchema);


module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel
}


