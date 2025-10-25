const jwt =require("jsonwebtoken")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const authMiddleware = (req,res,next)=>{
    try{
    // const authHeader = req.headers["authorization"]                          # use this if access token is sent to the client
    // const token =authHeader && authHeader.split(" ")[1]                      # use this if access token is sent to the client


    // accesstoken is stored on the cookies
    
    const token = req.cookies.accessToken;
  
    if(!token){
        return res.status(401).json({
            success:false,
            message:"access denied no token provided.please login to continue"
        })
    }
    
    // decode this token

   const decodeTokenInfo = jwt.verify(token,JWT_SECRET_KEY)
   
   req.userInfo = decodeTokenInfo
   next()
     
    }catch(error){ 
     next(error)
    }   
}            
module.exports = authMiddleware    
       