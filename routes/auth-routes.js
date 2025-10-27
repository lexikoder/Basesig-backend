const express = require("express")
const {reqOtp,verifyOtp,RegisterUser,LoginUser,refreshAccessToken,logout,decryptApikey, verify, getuserinfo} = require("../controller/auth-controller")
const {ratelimitingOtp} = require("../middleware/rateLimiting")
const authMiddleware = require("../middleware/authentication-middleware")
const router = express.Router()
const timeout =  require("express-timeout-handler");

otpCache = {};
const acesstokenpiration = 60; //in minutes
const refreshtokenpiration = 1; //in days

const timeoutOptions = {
  timeout: 1000, // 5 seconds
  onTimeout: function (req, res) {
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        message: "Request timed out. Please try again later.",
      });
    }
  },
  onDelayedResponse: function (req, method, args, requestTime) {
    console.warn(`Delayed response after ${requestTime}ms`);
  },
};

router.post("/reqotp",timeout.handler(timeoutOptions),reqOtp)
// ratelimitingOtp() this is a function that returns a middleware thats why we call ratelimitingOtp() 
// if it was a middleware we just do ratelimitingOtp like this router.post("/verifyotp",ratelimitingOtp,verifyOtp)
router.post("/verifyotp",ratelimitingOtp(),verifyOtp)
router.post("/register",RegisterUser)
router.post("/login",LoginUser)

router.post("/refreshtoken",refreshAccessToken)
router.post("/logout",authMiddleware,logout)
router.get("/verify",verify)
router.get("/getuserinfo",authMiddleware,getuserinfo)


module.exports = router

