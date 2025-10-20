export const passwordResetTemplate = (resetLink: string): string => `
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
      display: block;
      margin: 0 auto;
      width: fit-content; /* Ou uma largura específica */
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
      <h2>Solicitação de Redefinição de Senha</h2>
    </div>
    <p>Olá,</p>
    <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
    <p><a href="${resetLink}" class="button">Redefinir Senha</a></p>
    <p>Se você não fez essa solicitação, por favor ignore este e-mail.</p>
    <div class="footer">
      <p>Obrigado por utilizar nossa plataforma.</p>
    </div>
  </div>
</body>
</html>
`;
