const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstname:{
     type:String,
     required:[true,"firstname  required"],
     trim: true,
    },
    lastname:{ 
     type:String,
     required:[true,"lastname  required"],
     trim: true,
    },
    email:{
     type:String,
     required:[true,"email  required"],
     unique:true,
     trim: true,
     lowercase:true
    },
    password:{
     type:String,
     required:[true,"Password required"],
    },
    verificationtype:{
     type:String,
     default: "GovernmentId",
    },
    verified:{
     type:Boolean,
     default: true,
    },
    address:{
     type:String,
     
    },
    companyname:{
     type:String,
    },
    // role:{
    //     type:String,
    //     enum:["lender","admin"],
    //     default: "user"
    // }
},{timestamps:true})
 
const User =mongoose.model("User",userSchema)

module.exports = User
 