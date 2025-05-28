import { transporter } from "./transporterMail.js";
import { errorResponse } from "../utils/errorResponse.js";
import "dotenv/config.js";

const sendMail = async (email, resetToken) => {
  const linkReset = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `${process.env.EMAIL_USER}`,
    to: email,
    subject: "Redefinição de senha - Quadra Marcada",
    text: `Clique no link abaixo para redefinir sua senha`,
    html: `    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Redefinição de Senha</h2>
    <p style="font-size: 16px; color: #555;">Olá,</p>
    <p style="font-size: 16px; color: #555;">
      Recebemos uma solicitação para redefinir sua senha. Se você não fez essa solicitação, ignore este e-mail.
    </p>
    <p style="text-align: center;">
      <a href="${linkReset}" 
        style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #007bff; 
        text-decoration: none; border-radius: 5px; font-weight: bold;">
        Redefinir Senha
      </a>
    </p>
    <p style="font-size: 14px; color: #777; margin-top: 20px;">
      Este link é válido por 1 hora. Caso tenha problemas, solicite novamente a mudança de senha.
    </p>
    <p style="font-size: 14px; color: #777;">Atenciosamente, <br> Equipe Suporte - Quadra Marcada</p>
  </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Erro ao enviar o e-mail ao usuario ", err.message);
    errorResponse(response, 500, "Falha ao enviar o e-mail ao usuário");
  }
};

export { sendMail };
