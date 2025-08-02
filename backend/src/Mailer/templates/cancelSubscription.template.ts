export const cancelSubscriptionTemplate = (
  userName: string,
  appName: string,
  cancellationDate: string,
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
    .button-container {
      text-align: center;
      margin-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #dc3545;
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
      <h2>Subscription Cancellation Confirmation</h2>
    </div>
    <p>Hi ${userName},</p>
    <p>We're writing to confirm that your subscription to <strong>${appName}</strong> has been successfully canceled.</p>
    <p>Your subscription will remain active until <strong>${cancellationDate}</strong>. After this date, you will no longer have access to the subscription benefits.</p>
    <p>If you change your mind or wish to re-subscribe, you can do so at any time by visiting our website.</p>
    <div class="button-container">
      <a href="#" class="button">Manage Subscriptions</a>
    </div>
    <div class="footer">
      <p>Thank you for being a valued customer.</p>
    </div>
  </div>
</body>
</html>
`;
