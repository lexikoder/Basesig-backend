const User = require("../models/user");
// const SubscriptionApikey = require("../models/subscription-apikeys");
const refreshTokendb = require("../models/refreshToken");
const { nodemailerOtp } = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOtp");
const tryCatch = require("../utils/tryCatch");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


otpCache = {};
const acesstokenpiration = 60; //in minutes
const refreshtokenpiration = 1; //in days


const reqOtp = tryCatch(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("missing required field", 400);
  }
  const otp = generateOTP();
  //     // this is stored like this{"myeamail@gmail.com":{
  //   otp: otp,
  //   expiresAt: Date.now() + expirytimeinminutes * 60 * 1000, // 10 minutes
  //   verified: false
  // }}
  
  const expirytimeinminutes = 10;
  otpCache[email] = {
    otp: otp,
    expiresAt: Date.now() + expirytimeinminutes * 60 * 1000, // 10 minutes
    verified: false,
  };

  await nodemailerOtp(email, otp, expirytimeinminutes);

  res.status(200).json({
    success: true,
    message: "otp sent successfully",
  });
});

const verifyOtp = tryCatch(async (req, res) => {
  const { email, otp } = req.body;

  if (!otpCache.hasOwnProperty(email)) {
    throw new AppError("otp not yet requested", 400);
  }

  if (Date.now() > otpCache[email].expiresAt) {
    delete otpCache[email];
    throw new AppError("OTP expired", 400);
  }

  if (otpCache[email].verified === true) {
    throw new AppError("OTP verified", 400);
  }

  if (otpCache[email].otp === otp.trim()) {
    // delete otpCache[email] should occur when you register
    otpCache[email].verified = true;
    console.log("successfull requested otp", Date)
    return res.status(200).json({
      success: true,
      message: "otp verified successfuly",
    });
  } else {
    throw new AppError("Invalid Otp", 400);
  }
});

// Register endpoint
const RegisterUser = tryCatch(async (req, res) => {
  const userData = req.body;
  if (!userData.password  || !userData.email || !userData.lastname || !userData.firstname || !userData.companyname) {
    throw new AppError("missing required field", 400);
  }

  // const checkUserNameExist = await User.findOne({
  //   username: userData?.username,
  // });
  const checkEmailExist = await User.findOne({ email: userData?.email });

  if ( checkEmailExist) {
    throw new AppError("email or username already exist", 404);
  }

  if (!otpCache[userData.email] || !otpCache[userData.email]?.verified) {
    throw new AppError("Email not verified with OTP", 400);
  }
  delete otpCache[userData.email];
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData?.password, salt);
  let NewUserData = { ...userData, password: hashedPassword };
  const newlycreatedUser = await User.create(NewUserData);
  if (newlycreatedUser) {
    return res.status(201).json({
      success: true,
      message: "created successfully",
    });
  }
});

// Login end point
const LoginUser = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  const checkEmailExist = await User.findOne({ email: email});
  if (!checkEmailExist) {
    throw new AppError("Invalid credentials", 400);
  }
  const isPasswordMatch = await bcrypt.compare(
    password,
    checkEmailExist?.password
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const accessToken = jwt.sign(
    {
      userId: checkEmailExist._id,
      username: checkEmailExist.email,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: `${acesstokenpiration}m`,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: checkEmailExist._id,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: `${refreshtokenpiration}d`,
    }
  );

  await refreshTokendb.create({
    token: refreshToken,
    user: checkEmailExist._id,
    //expires in 1 day
    // 1 * 24 * 60 * 60 * 1000
    expiresAt: new Date(Date.now() + 3 * 60 * 1000),
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    // process.env.NODE_ENV === "production",
    // sameSite: "Strict",
    sameSite: "none",
    maxAge: acesstokenpiration * 60 * 1000, // in  minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure:true,
    //  process.env.NODE_ENV === "production",
    sameSite: "none",
    // sameSite: "Strict",
    maxAge: refreshtokenpiration * 24 * 60 * 60 * 1000, // in  days
  });

  return res.status(201).json({
    success: true,
    message: "logged in successfully",
    // accessToken: accessToken,
    // refreshToken: refreshToken
  });
});

const refreshAccessToken = tryCatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token not provided", 401);
  }

  const storedToken = await refreshTokendb.findOne({ token: refreshToken });
  if (!storedToken) {
    throw new AppError("Invalid refresh token", 403);
  }

  const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

  // 3. Find user and generate new access token
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.email,
      role: user.role,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: `${acesstokenpiration}m`,
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/", 
    maxAge: acesstokenpiration * 60 * 1000, // in  minutes
  });

  return res.status(201).json({
    success: true,
    message: "Accesstoken generated",
    // accessToken: accessToken,
  });
});

const logout = tryCatch(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (refreshToken) {
    await refreshToken.deleteOne({ token: refreshToken });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

const verify = (req, res) => {
  const token = req.cookies.accessToken;
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return res.json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

const getuserinfo = tryCatch(async (req, res) => {
  const user = req.userInfo;
  const sign = req.body;
  // if (!sign.contractid || !sign.txOnchain ) {
  //   throw new AppError("missing required field", 400);
  // }
  const userinfo = await User.findOne({ _id: user.userId });
  if (!userinfo) {
    throw new AppError("user not found", 404);
  }
  
  
   

   return res.status(200).json({
      success: true,
      message: "user info gotten",
      data:{
        name:`${userinfo.lastname} ${userinfo.firstname}`
      }
      
    });
});


module.exports = {
  reqOtp,
  verifyOtp,
  RegisterUser,
  LoginUser,
  refreshAccessToken,
  logout,
  verify,
  getuserinfo
};
