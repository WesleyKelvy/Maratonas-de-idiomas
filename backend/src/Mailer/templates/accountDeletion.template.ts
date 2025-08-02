export const accountDeletionTemplate = (userName: string): string => `
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Account Deletion Confirmation</h2>
    </div>
    <p>Hi ${userName},</p>
    <p>We’re writing to confirm that your account has been successfully deleted from our system. All your data has been removed as per your request.</p>
    <p>If this was a mistake or you have any concerns, please contact our support team immediately.</p>
    <p>We’re sorry to see you go. If you ever decide to return, we’ll be happy to welcome you back!</p>
    <div class="footer">
      <p>Thank you for using our service.</p>
      <p>If you have any questions, please don’t hesitate to reach out to our support team.</p>
    </div>
  </div>
</body>
</html>
`;
