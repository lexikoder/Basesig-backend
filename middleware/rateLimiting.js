const rateLimit = require("express-rate-limit");

const ratelimitingOtp = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Allow only 5 attempts
    message: "Too many OTP attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const ratelimitingGeneral = (maxrequest, time) => {
  // this return a middleware
  return rateLimit({
    windowMs: time,
    max: maxrequest,
    message: "Too many attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = { ratelimitingOtp, ratelimitingGeneral };
