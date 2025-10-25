function resetLinkTemplate(name, resetLink ,expires) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
    <style>
      .button {
        background-color: #007bff;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        font-weight: bold;
      }
      .container {
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hello ${name || "there"},</p>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <p>
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      
      <p>This link will expire in ${expires} minutes.</p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <br />
      <p>Best regards,<br />The YourApp Team</p>
    </div>
  </body>
</html>
  `;
}

module.exports = resetLinkTemplate;