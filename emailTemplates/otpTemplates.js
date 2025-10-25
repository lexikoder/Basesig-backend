function generateOtpEmail(name, otp,expires ) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        .container {
          font-family: 'Arial', sans-serif;
          max-width: 480px;
          margin: auto;
          padding: 24px;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          background-color: #ffffff;
          color: #333333;
        }
        .otp-box {
          font-size: 24px;
          font-weight: bold;
          background-color: #f0f4ff;
          padding: 16px;
          text-align: center;
          border-radius: 6px;
          letter-spacing: 4px;
          margin: 20px 0;
          color: #2b4eff;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          margin-top: 24px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Email Verification OTP</h2>
        <p>Hi ${name || "there"},</p>
        <p>Use the OTP below to verify your email address:</p>

        <div class="otp-box">${otp}</div>

        <p>This OTP is valid for only <strong>${expires} minutes</strong>. Do not share it with anyone.</p>

        <div class="footer">
          If you did not request this, please ignore this email.
          <br />— The DevTeam
        </div>
      </div>
    </body>
  </html>
  `;
}

module.exports = generateOtpEmail;
