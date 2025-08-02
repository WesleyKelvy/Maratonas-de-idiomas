export const accountCreationTemplate = (userName: string): string => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to Our Service!</h2>
    </div>
    <p>Hi ${userName},</p>
    <p>We’re excited to welcome you to our platform! Your account has been successfully created, and you can now start exploring all the features and benefits we offer.</p>
    <p>To get started, click the button below to log in and explore:</p>
    <a href="https://your-service-url.com/login" class="button">Log In to Your Account</a>
    <p>If you have any questions or need assistance, don’t hesitate to contact our support team. We’re here to help!</p>
    <div class="footer">
      <p>Thank you for joining us!</p>
      <p>If you need help, please reach out to our <a href="https://your-service-url.com/support">support team</a>.</p>
    </div>
  </div>
</body>
</html>
`;
