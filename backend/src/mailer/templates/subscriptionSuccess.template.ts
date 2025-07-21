export const subscriptionSuccessTemplate = (username: string): string => `
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
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #28a745;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      text-align: center;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to Our App!</h2>
    </div>
    <p>Hi ${username},</p>
    <p>Your subscription was successful! We're thrilled to have you on board.</p>
    <p>Enjoy exploring all the features and benefits of our service.</p>
    <div class="footer">
      <p>Thank you for joining us.</p>
    </div>
  </div>
</body>
</html>
`;
