import { usersModels } from "../models/usersModels.js";
import { compareHash } from "../service/comparePassword.js";
import { errorResponse } from "../utils/errorResponse.js";
import { passwordHash } from "../service/passwordHash.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { generateToken } from "../utils/generateToken.js";
import { sendMail } from "../service/sendMail.js";
import { logAction } from "../service/logAction.js";
import { encryptData } from "../service/encryptData.js";
import { lockAccount } from "../utils/lockAccount.js";
import { anonimizarData } from "../service/anonimizarDados.js";
import { decryptData } from "../service/decryptData.js";

class usersControllers {
  async create(request, response) {
    try {
      const { nome, data, email, endereco, cep, telefone, password, cpf } =
        request.body;

      const userAlreadyExists = await usersModels.findOne({ email });

      if (userAlreadyExists) {
        return errorResponse(response, 400, "E-mail já cadastrado!");
      }

      const hashPassword = await passwordHash(password);

      await usersModels.create({
        nome,
        data,
        email,
        endereco: encryptData(endereco),
        cep: encryptData(cep),
        telefone: encryptData(telefone),
        password: hashPassword,
        cpf: encryptData(cpf),
        role: "usuario",
      });

      await logAction({
        action: "Cadastro de usuário",
        details: { email, nome },
        ip: request.ip,
      });

      return response
        .status(201)
        .json({ message: "Sua conta foi criado com sucesso jogador!" });
    } catch (err) {
      console.error("Erro ao cadastrar usuário", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async login(request, response) {
    try {
      const { email, password } = request.body;

      const userAlreadyExists = await usersModels.findOne({ email });

      if (!userAlreadyExists) {
        return errorResponse(response, 404, "E-mail ou senha incorretos!");
      }

      if (lockAccount(userAlreadyExists)) {
        return errorResponse(
          response,
          423,
          "Conta bloqueada temporariamente. Tente novamente mais tarde"
        );
      }

      const isPasswordValid = await compareHash(
        password,
        userAlreadyExists.password
      );

      if (!isPasswordValid) {
        userAlreadyExists.loginAttempts += 1;

        if (userAlreadyExists.loginAttempts >= 5) {
          userAlreadyExists.lockAccount = Date.now() + 30 * 60 * 1000;
        }

        await userAlreadyExists.save();

        return errorResponse(response, 400, "E-mail ou senha incorretos!");
      }

      userAlreadyExists.loginAttempts = 0;
      userAlreadyExists.lockAccount = null;
      await userAlreadyExists.save();

      const token = jwt.sign(
        { userId: userAlreadyExists._id, role: userAlreadyExists.role },
        process.env.SECRET_KEY,
        { expiresIn: 300 }
      );

      await logAction({
        action: "Login de usuario",
        details: { email },
        ip: request.ip,
      });

      return response.status(200).json({
        auth: true,
        token,
        user: {
          id: userAlreadyExists._id,
          nome: userAlreadyExists.nome,
          role: userAlreadyExists.role,
        },
        message: "Você foi logado com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao logar com o usuário ", err.message);
    }
  }

  async delete(request, response) {
    try {
      const userId = request.userId;

      const user = await usersModels.findById(userId);

      if (!user) {
        return errorResponse(response, 404, "Usuário não encontrado!");
      }

      await usersModels.findByIdAndUpdate(userId, anonimizarData(user));

      await logAction({
        userId,
        action: "Anonimização dos dados do usuario",
        ip: request.ip,
      });

      return response.status(200).json({
        message: "Os seus dados foram anonimizados com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao deletar a conta do usuario ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async forgotPassword(request, response) {
    try {
      const { email } = request.body;

      const user = await usersModels.findOne({ email });

      if (!user) {
        return response.status(200).json({
          message: "Caso este e-mail esteja cadastrado, um link foi enviado!",
        });
      }

      const resetToken = generateToken();
      const resetExpiredToken = new Date(Date.now() + 3 * 60 * 60 * 1000);

      user.resetToken = resetToken;
      user.resetExpiredToken = resetExpiredToken;

      await user.save();

      await sendMail(user.email, resetToken);

      await logAction({
        user: user._id,
        action: "Solicitação de recuperar senha",
        ip: request.ip,
      });

      return response.status(200).json({
        message: "Caso este e-mail esteja cadastrado, um link foi enviado!",
      });
    } catch (err) {
      console.error("Erro ao solicitar redefinição de senha:", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async resetPassword(request, response) {
    try {
      const { token } = request.params;
      const { password } = request.body;

      if (!token || typeof token !== "string") {
        return errorResponse(response, 400, "Token inválido ou ausente");
      }

      const user = await usersModels.findOne({
        resetToken: token,
        resetExpiredToken: { $gt: new Date() },
      });

      if (!user) {
        return errorResponse(
          response,
          401,
          "Tempo de redefinição de senha expirado ou token inválido!"
        );
      }

      const hashedPassword = await passwordHash(password);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetExpiredToken = null;

      await user.save();

      await logAction({
        user: user._id,
        action: "Alteração de senha",
        ip: request.ip,
      });

      return response.status(200).json({
        message: "Sua senha foi redefinida com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao redefinir a senha do usuário:", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async profileUser(request, response) {
    try {
      const users = await usersModels.findById(request.userId);

      if (!users) {
        return errorResponse(response, 404, "Usuário não encontrado");
      }

      return response.status(200).json({
        nome: users.nome,
        email: users.email,
        data: users.data,
        endereco: decryptData(users.endereco),
        telefone: decryptData(users.telefone),
        cep: decryptData(users.cep),
        fotoPerfil: users.fotoPerfil || "default.png",
        role: users.role,
      });
    } catch (err) {
      console.error("Erro ao mostrar perfil ao usuario ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async updateProfile(request, response) {
    try {
      const { nome, email, data, endereco, telefone, cep } = request.body;
      const userId = request.userId;

      const user = await usersModels.findById(userId);
      if (!user) {
        return errorResponse(response, 404, "Usuário não encontrado");
      }

      const updateUser = {};

      if (nome && typeof nome === "string") updateUser.nome = nome;
      if (email && typeof email === "string") updateUser.email = email;
      if (data) updateUser.data = data;

      if (endereco && typeof endereco === "string")
        updateUser.endereco = encryptData(endereco);

      if (telefone && typeof telefone === "string")
        updateUser.telefone = encryptData(telefone);

      if (cep && typeof cep === "string") updateUser.cep = encryptData(cep);

      if (request.file) {
        if (user.fotoPerfil) {
          const caminhoAntigo = path.join("uploads", user.fotoPerfil);
          if (fs.existsSync(caminhoAntigo)) {
            fs.unlinkSync(caminhoAntigo);
          }
        }
        updateUser.fotoPerfil = request.file.filename;
      }

      await usersModels.findByIdAndUpdate(userId, updateUser);

      return response.status(200).json({
        message: "Seu perfil foi atualizado com sucesso!",
        fotoPerfil: updateUser.fotoPerfil || user.fotoPerfil,
      });
    } catch (err) {
      console.error("Erro ao atualizar o perfil ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }
}

export default new usersControllers();
