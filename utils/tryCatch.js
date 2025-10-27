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

// const tryCatch = (controller, timeoutMs = 30000) => {
//   return async (req, res, next) => {
//     const timer = setTimeout(() => {
//       if (!res.headersSent) {
//         res.status(408).json({ error: "Request timed out" });
//       }
//     }, timeoutMs);

//     try {
//       await controller(req, res, next);
//     } catch (err) {
//       console.error(err);
//       if (!res.headersSent) next(err);
//     } finally {
//       clearTimeout(timer);
//     }
//   };
// };


