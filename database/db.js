const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;
      
async function connectToDB() {
  try {
    
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB successfully!");
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw  error;
  }
}   

module.exports = connectToDB 

