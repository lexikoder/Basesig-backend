const adminAuthorizationMiddleware = (req,res,next)=>{
    const  {role} = req.userInfo
    if (role !== "admin"){
         return res.status(403).json({
            success:false,
            message:"access denied ,only admin has permission"
        })
    }
    next()  
}           
 
module.exports = adminAuthorizationMiddleware 