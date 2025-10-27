const nodemailer = require("nodemailer");
const generateOtpEmail = require("../emailTemplates/otpTemplates");
const resetLinkTemplate = require("../emailTemplates/resetLinkTemplates");

require("dotenv").config();
const EMAIL = process.env.EMAIL;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

const nodemailerResetLink = async (
  toemailaddress,
  username,
  resetLink,
  expires
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL,
        pass: EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: { name: "Admin", address: EMAIL },
      to: toemailaddress,
      subject: "Reset Password",
      html: resetLinkTemplate(username, resetLink, expires), // HTML body
    });
  } catch (e) {
    console.log(e);
    throw error;
  }
};

const nodemailerOtp = async (toemailaddress, otp, expires) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: EMAIL,
        pass: EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: { name: "Admin", address: EMAIL },
      to: toemailaddress,
      subject: "OTP Verification",
      html: generateOtpEmail("user", otp, expires), // HTML body
    });
  } catch (e) {
    console.log(e);
    throw error;
  }
};

module.exports = { nodemailerResetLink, nodemailerOtp };
