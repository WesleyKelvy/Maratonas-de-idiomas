export const sendRefundNotificationEmail = (
  username: string,
  refundAmount: number,
): string => `
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
      <h2>Refund Notification</h2>
    </div>
    <p>Hi ${username},</p>
    <p>We’re writing to inform you that a refund of <strong>${refundAmount}</strong> has been processed successfully.</p>
    <p>If you have any questions or concerns, please don’t hesitate to contact our support team.</p>
    <div class="footer">
      <p>Thank you for being with us.</p>
    </div>
  </div>
</body>
</html>
`;
