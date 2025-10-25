require("dotenv").config();
const express = require("express");
const app = express();
// const bookRoutes = require("./routes/book-routes") 
// const authRoutes = require("./routes/auth-routes")
// const walletRoutes = require("./routes/wallet-routes")
// const apikeyRoutes = require("./routes/apikey-routes")
const connectMongoDb = require("./database/db")
const port = process.env.PORT ;
const configureCors = require("./middleware/corsConfig");
const {ratelimitingGeneral} = require("./middleware/rateLimiting")
const errorHandler = require("./middleware/errorHandler")
const helmet = require("helmet")
const cookieParser = require('cookie-parser');
const contractRoute = require("./routes/contract-routes");
const authRoutes = require("./routes/auth-routes")
// const { Uploadandsign } = require("./controller/contract-controller");

app.use(helmet());
app.use(configureCors()) 
app.use(ratelimitingGeneral(100,15*60*1000))
app.use(express.json())
app.use(cookieParser());
 
   
  
app.use("/api/auth", authRoutes); 
// app.use("/api/wallet", walletRoutes); 
app.use("/api/contract", contractRoute);    
// app.use("/api/users",Uploadandsign); 

app.use(errorHandler)

async function runServer() {
  try {
    await connectMongoDb();

    app.listen(port, () => {
    
      console.log(`Server running on port ${port}`);
    });
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
runServer();



