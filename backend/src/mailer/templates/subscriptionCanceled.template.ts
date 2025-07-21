export const subscriptionCanceledTemplate = (username: string): string => `
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
      background-color: #007bff;
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
      <h2>We're Sorry to See You Go</h2>
    </div>
    <p>Hi ${username},</p>
    <p>Your subscription has been successfully canceled. We're sad to see you leave but hope you enjoyed your time with us.</p>
    <p>If there's anything we can do to improve, please let us know. We'd love to have you back anytime in the future.</p>
    <p>
      <a href="https://your-app.com/feedback" class="button">Share Feedback</a>
    </p>
    <div class="footer">
      <p>Thank you for being a part of our journey.</p>
      <p>&copy; ${new Date().getFullYear()} Your App Name</p>
    </div>
  </div>
</body>
</html>
`;
