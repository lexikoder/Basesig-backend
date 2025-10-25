const tryCatch = (controller) => {
 return async(req,res,next) =>{
   try{
     await controller(req,res)
   }catch(e){
    console.log(e)
       next(e)
   }
   }
}

module.exports = tryCatch

