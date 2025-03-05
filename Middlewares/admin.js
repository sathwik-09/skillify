const jwt = require('jsonwebtoken')

const adminMiddleware = (req,res,next)=>{
  const token = req.headers.token;
  const decodedData = jwt.verify(token, process.env.JWT_ADMIN_SECRET)
  if(decodedData){
    req.adminId = decodedData.id;
    next();
  }else{
    res.status(403).json({
      message: "You need to sign in"
    })
  }
}

module.exports = {
  adminMiddleware: adminMiddleware
}