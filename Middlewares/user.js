const jwt = require('jsonwebtoken')

const userMiddleware = (req,res,next)=>{
  const token = req.headers.token;
  console.log("Received Token:", token);  
  const decodedData = jwt.verify(token, process.env.JWT_USER_SECRET)
  if(decodedData){
    req.userId = decodedData.id;
    next();
  }else{
    res.status(403).json({
      message: "You need to sign in"
    })
  }
}

module.exports = {
  userMiddleware: userMiddleware
}