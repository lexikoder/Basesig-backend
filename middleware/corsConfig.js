const cors = require("cors")

const configureCors = () =>{
    return cors({
        origin:(origin,callback)=>{
            const allowedOrigins = [
                "http://localhost:8080",
                "basesig.xyz", //production domain
                "app.basesig.xyz"
            ]
             // ⚠️ In production, remove `!origin` to block requests from tools like Postman
      // Postman and similar tools don’t send an Origin header,
      // so attackers could bypass CORS checks if this is left in

    //  !origin || allowedOrigins.indexOf(origin) !== -1  when testing 
    // allowedOrigins.indexOf(origin) !== -1   and only this for production
            if(process.env.NODE_ENV ==="production"){
                if(allowedOrigins.indexOf(origin) !== -1){
                callback(null,true)
            }else{
                callback(new Error("Not allowed by cors"),false)
            }
            }else{
                if(!origin || allowedOrigins.indexOf(origin) !== -1){
                callback(null,true)
            }else{
                callback(new Error("Not allowed by cors"),false)
            }
            }
            
        },
        // methods: ["GET","POST","PUT","DELETE"],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Accept-Version"
        ],
        exposedHeaders: ["X-Total-Count","Content-Range"],
        credentials: true,
        preflightContinue: false,
        maxAge: 600, // cache
        optionsSuccessStatus:204
       
    })
}

module.exports = configureCors