const User = require("../models/user");
// const SubscriptionApikey = require("../models/subscription-apikeys");

const tryCatch = require("../utils/tryCatch");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// const { v4: uuidv4 } = require("uuid");

const mongoose = require("mongoose")

const cloudinary = require("../utils/cloudinary")
const fs = require("fs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const Contract = require("../models/contract");



// Register endpoint
const Uploaddoc = tryCatch(async (req, res) => {
  const uploaddoc = req.body;
  if (!uploaddoc.contractname  || !uploaddoc.recipientemail || !uploaddoc.expiresin ) {
    throw new AppError("missing required field", 400);
  }
  const recipientemail = await User.findOne({ email: uploaddoc?.recipientemail });
  if (!recipientemail) {
    throw new AppError("recipient not found", 404);
  }
  console.log(req.file)
  const result = await cloudinary.uploader.upload(req.file.path,{
  resource_type: "auto",
  access_mode: "public",
});
      
  const fileBuffer = fs.readFileSync(req.file.path);
  const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  let contractid = uuidv4();
  console.log(req.userInfo,"kk")
  let NewcontractData = { ...uploaddoc, contractid:contractid,documenthash:hash,signerid:req.userInfo.userId,recipientid:recipientemail._id,documenturl:result.secure_url };
  // const newlycreatedUser = await User.create(NewUserData);
  const newlycreatedContract = await Contract.create(NewcontractData);
  if (newlycreatedContract) {
    return res.status(201).json({
      success: true,
      message: "created successfully",
      data:{
        contractid:contractid,
        documenthash:hash
      }
    });
  }
});

 const signcontract = tryCatch(async (req, res) => {
  const user = req.userInfo;
  const sign = req.body;
  if (!sign.contractid || !sign.txOnchain) {
    throw new AppError("missing required field", 400);
  }
  const contract = await Contract.findOne({ contractid: sign.contractid });
  if (!contract) {
    throw new AppError("contract not found", 404);
  }
let  updated
  const contractsigner = await Contract.findOne({ contractid: sign.contractid  }).populate("signerid");
   const formattedDate = new Date(Date.now()).toISOString().split('T')[0];
console.log(contractsigner,"ll"); 
// const idString = "68f9fa53439d986acacecaf0";
// const objectId = new mongoose.Types.ObjectId(idString);
 if (contractsigner.signerid._id.equals(user.userId)) {
   const initials = contractsigner.signerid.lastname[0].toUpperCase() + contractsigner.signerid.firstname[0].toUpperCase();
    console.log(initials,"initialss")
    updated = await Contract.findOneAndUpdate(
  // { contractid: sign.contractid },
  { 
    contractid: sign.contractid, 
    "participants.1": { $exists: false }  // means second element doesn’t exist yet
  },
  { $set: { signerstatus: "signed" ,signerTxonchain:sign.txOnchain,createdat:formattedDate},$push: { participants: initials } },
  
  { new: true } // returns updated document instead of old one
);

 }
 const contractrecipient = await Contract.findOne({ contractid: sign.contractid  }).populate("recipientid");
 
 if (contractrecipient.recipientid._id.equals(user.userId)) {
   const initials = contractrecipient.recipientid.lastname[0].toUpperCase() + contractrecipient.recipientid.firstname[0].toUpperCase();
 console.log(initials)
    updated = await Contract.findOneAndUpdate(
  // { contractid: sign.contractid },
  { 
    contractid: sign.contractid, 
    "participants.1": { $exists: false }  // means second element doesn’t exist yet
  },
  { $set: { recipientstatus: "signed",recipientTxonchain:sign.txOnchain,completedAt:formattedDate,contractcompleted:true},$push: { participants: initials } },

  { new: true } // returns updated document instead of old one
);
 }
//  updated = await Contract.findOneAndUpdate(
//   { contractid: sign.contractid },
//   {
//     $set: {
//       recipientstatus: "signed",
//       recipientTxonchain: sign.txOnchain,
//       completedAt: formattedDate,
//       contractcompleted: true,
//     },
//     $addToSet: { participants: initials },
//   },
//   { new: true } // return the updated document
// );

  console.log(updated)
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "update failed",
      });
    }

   return res.status(200).json({
      success: true,
      message: "contract signed successfully",
    });

  

  
});


const applyforearlypayment = tryCatch(async (req, res) => {
  const user = req.userInfo;
  const sign = req.body;
  if (!sign.contractid || !sign.amount || !sign.interest || !sign.repaymentby) {
    throw new AppError("missing required field", 400);
  }
  const contract = await Contract.findOne({ contractid: sign.contractid });
  if (!contract) {
    throw new AppError("contract not found", 404);
  }

  const repayer = await User.findOne({ email: sign.repaymentby });
  if (!repayer) {
    throw new AppError("repayer not found", 404);
  }
 
  const earlypaymentamount =parseFloat(sign.amount) * (1 - parseFloat(sign.interest) / 100);

  const updated = await Contract.findOneAndUpdate(
  { contractid: sign.contractid },
  { $set: {
      requestearlyfund: true,
      requestearlyfunduser: user.userId,
      requestearlyfundamount: sign.amount,
      requestearlyfundinterest: sign.interest,
      earlypaymentamount:String(earlypaymentamount)
    } },
  { new: true } 
);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "update failed",
      });
    }

   return res.status(200).json({
      success: true,
      message: "applied successfully",
    });
});


const contractfinancing = tryCatch(async (req, res) => {
  const user = req.userInfo;
  const sign = req.body;
  if (!sign.contractid || !sign.txOnchain ) {
    throw new AppError("missing required field", 400);
  }
  const contract = await Contract.findOne({ contractid: sign.contractid });
  if (!contract) {
    throw new AppError("contract not found", 404);
  }
  const updated = await Contract.findOneAndUpdate(
  { contractid: sign.contractid },
  { $set: {
      requestfinancer:user.userId,
      requestfinancerTxonchain:sign.txOnchain
    } },
  { new: true } 
);
  
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "update failed",
      });
    }

   return res.status(200).json({
      success: true,
      message: "financed early payment successfully",
    });
});


const makepayment = tryCatch(async (req, res) => {
  const user = req.userInfo;
  const sign = req.body;
  if (!sign.contractid || !sign.txOnchain ) {
    throw new AppError("missing required field", 400);
  }
  const updated = await Contract.findOneAndUpdate(
  { contractid: sign.contractid },
  { $set: {
      paymentstatus:"completed",
      paymentTxonchain:sign.txOnchain
    } },
  { new: true } 
);
  
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "update failed",
      });
    }

   return res.status(200).json({
      success: true,
      message: "payment made successfully",
    });
});

const getalldocs = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
  $or: [
    { signerid: user.userId },
    { recipientid: user.userId }
  ]
}).select("documenturl contractname");
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});


const getcontractdetails = tryCatch(async (req, res, next) => {
  const { contractid } = req.params;
  console.log(contractid)
  const user = req.userInfo;
  const contract = await Contract.findOne({ contractid: contractid }).populate("signerid").populate("recipientid");
  if (!contract) {
    throw new AppError("contract not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contract,
    });
});


const getallactivities = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
  $or: [
    { signerid: user.userId },
    { recipientid: user.userId }
  ]
})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});

const getallrecipientstatuspending = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
  $and: [
    {recipientid:user.userId,recipientstatus: "pending" }
  ]
})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});

const getallrecipientstatuscompleted = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
  $and: [
    {recipientid:user.userId,recipientstatus: "completed" }
  ]
})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});


const getallcompletedusercontract = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
   
  $or: [
    { signerid: user.userId, contractcompleted:true },
    { recipientid: user.userId,contractcompleted:true }
  ]


})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});

const getallcompletedusercontractforfinancing = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
  
  $and: [
    
    { requestearlyfund:true,
      signerstatus: "signed",
      recipientstatus: "signed"
    }
  ]

})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});


const getallpendingfinancedcontract = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
     $and: [
    { requestfinancer:user.userId,
      paymentstatus: "pending",
    }
  ]})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});

const getallcompletedfinancedcontract = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;
  const contracts = await Contract.find({
     $and: [
    { requestfinancer:user.userId,
      paymentstatus: "completed",
    }
  ]})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});


const makepaymentforcontract = tryCatch(async (req, res, next) => {
  // const { userId } = req.params;
  const user = req.userInfo;

  const repayer = await User.findOne({ _id: user.userId });
  if (!repayer) {
    throw new AppError("repayer not found", 404);
  }
  const contracts = await Contract.find({
     $and: [
    { repaymentby:repayer.email,
      paymentstatus: "pending",
    }
  ]})
  if (!contracts) {
    throw new AppError("data not found", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      message: "data retrieved successfully",
      data: contracts,
    });
});

module.exports = {
Uploaddoc,
signcontract,
applyforearlypayment,
contractfinancing,
makepayment,
getalldocs,
getallactivities,
getallrecipientstatuspending,
getallrecipientstatuscompleted,
getallcompletedusercontract,
getallcompletedusercontractforfinancing,
getallpendingfinancedcontract,
getallcompletedfinancedcontract,
makepaymentforcontract,
getcontractdetails
}