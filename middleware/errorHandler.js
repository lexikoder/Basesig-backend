const AppError = require("../utils/appError");
const errorHandler = (error,req,res,next) => {

   if (error.name === "ValidationError"){
        return res.status(400).json({
            success:false,
            message:error.message
        })
   }

   if (error.code === 11000) {
    return res.status(400).json({
            success:false,
            message:error.message
        })
  }
                   
  if (error.name === "TokenExpiredError") {
     return res.status(401).json({
            success:false,
            message:error.message
        })
      
    } 
  if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
            success:false,
            message:error.message
        })
    }
 
   if(error instanceof AppError){
    return res.status(error.statusCode).json({
            success:false,
            message:error.message
        })
   }

   return res.status(500).json({
        success:false,
        message:"something went wrong", 
        err:error
   })
   
}

module.exports = errorHandler