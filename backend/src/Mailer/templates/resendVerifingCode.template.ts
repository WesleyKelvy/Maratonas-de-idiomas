export const resendVerifingCodeTemplate = (
  userName: string,
  code: string,
  appName: string,
): string => `
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
    #code {
      margin: auto
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      display: block;
      width: fit-content;
      margin: 0 auto;
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
      <h2>${appName}</h2>
    </div>
    <p>Olá ${userName},</p>
    <p>Seu código é:</p>
    <p id="code">${code}</p>
    <p>Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato com nossa equipe de suporte. Estamos aqui para ajudar!</p>
    <div class="footer">
      <p>Obrigado por se juntar a nós!</p>
      <p>Se precisar de ajuda, entre em contato com nossa <a href="https://your-service-url.com/support">equipe de suporte</a>.</p>
    </div>
  </div>
</body>
</html>
`;
