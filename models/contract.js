const mongoose = require("mongoose")

const contractSchema = new mongoose.Schema({
    createdat:{
     type:String,
    },
    completedAt:{
     type:String,
    },
    contractid:{
     type:String,
     unique:true,
     required:[true,"contractid  required"],
    },
    documenthash:{
     type:String,
     unique:true,
     required:[true,"documenthash  required"],
     
    },
    contractname:{
     type:String,
     required:[true,"contractname  required"],
    },
    signerid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipientid:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contractcompleted:{
     type:Boolean,

    },
    signerstatus:{
        type:String,
        enum:["pending", "signed"], 
        default:"pending"   
    },
    recipientstatus:{
        type:String,
        enum:["pending", "signed"], 
        default:"pending"    
    },
    signerTxonchain:{
     type:String,
    },
    recipientTxonchain:{
     type:String,
    },
    expiresin :{
     type:String,
     required:[true,"expired time  required"],
    },
    documenturl:{
     type:String,
     required:[true,"documenturl  required"],
     unique:true,
    },
    
    requestearlyfund:{
     type:Boolean,

    },
    requestearlyfunduser:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    requestearlyfundasset:{
     type:String,
     enum:["usdt"],
     default:"usdt"
     
    },
    requestearlyfundamount:{
     type:String,
    },
    requestearlyfundinterest:{
     type:String,
    },
    earlypaymentamount:{
     type:String,
    },
    repaymentby:{
     type:String,
    },
    requestfinancer: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    requestfinancerTxonchain:{
     type:String,
    },
    paymentstatus:{
        type:String,
        enum:["pending", "completed"],   
        default:"pending" 
    },
    paymentTxonchain:{
     type:String,
    },
      
   
},{timestamps:true})
 
const Contract =mongoose.model("Contract",contractSchema)

module.exports = Contract