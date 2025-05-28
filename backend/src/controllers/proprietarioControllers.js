import { usersModels } from "../models/usersModels.js";
import { errorResponse } from "../utils/errorResponse.js";
import { passwordHash } from "../service/passwordHash.js";
import "dotenv/config.js";
import { logAction } from "../service/logAction.js";
import { encryptData } from "../service/encryptData.js";

class proprietarioControllers {
  async create(request, response) {
    try {
      const { nome, data, email, endereco, cep, telefone, password, cnpj } =
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
        cnpj: encryptData(cnpj),
        role: "proprietario",
      });

      await logAction({
        action: "Cadastro de proprietario",
        details: { email, nome },
        ip: request.ip,
      });

      return response
        .status(201)
        .json({ message: "Sua conta foi criado com sucesso proprietario!" });
    } catch (err) {
      console.error("Erro ao cadastrar usuário", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }
}

export default new proprietarioControllers();
