import { quadraModels } from "../models/quadraModels.js";
import { errorResponse } from "../utils/errorResponse.js";

class quadraControllers {
  async create(request, response) {
    try {
      const {
        nome,
        tipoQuadra,
        capacidadePessoas,
        cep,
        endereco,
        nomeProprietario,
        telefone,
        valorQuadra,
        tipoEstacionamento,
        foto,
      } = request.body;

      const enderecoAlreadyExists = await quadraModels.findOne({ endereco });

      if (enderecoAlreadyExists) {
        return errorResponse(response, 400, "Quadra já foi cadastrada");
      }

      await quadraModels.create({
        nome,
        tipoQuadra,
        capacidadePessoas,
        cep,
        endereco,
        nomeProprietario,
        telefone,
        valorQuadra,
        tipoEstacionamento,
        foto,
        userId: request.userId,
      });

      return response.status(201).json({
        message: "Sua quadra foi cadastrada com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao cadastrar quadra ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const {
        nome,
        tipoQuadra,
        capacidadePessoas,
        cep,
        endereco,
        nomeProprietario,
        telefone,
        valorQuadra,
        tipoEstacionamento,
        foto,
      } = request.body;
      const userId = request.userId;

      const updatedQuadra = await quadraModels.findById(id);

      if (!updatedQuadra) {
        return errorResponse(response, 404, "Quadra não encontrada");
      }

      if (updatedQuadra.userId !== userId) {
        return errorResponse(
          response,
          403,
          "Você não tem permissão para editar esta quadra"
        );
      }

      await quadraModels.findByIdAndUpdate(id, {
        nome,
        tipoQuadra,
        capacidadePessoas,
        cep,
        endereco,
        nomeProprietario,
        telefone,
        valorQuadra,
        tipoEstacionamento,
        foto,
      });

      return response.status(200).json({
        message: "Sua quadra foi atualizada com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao atualizar quadra ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;
      const userId = request.userId;

      const quadraDeleted = await quadraModels.findById(id);

      if (!quadraDeleted) {
        return errorResponse(response, 404, "Quadra não encontrada");
      }

      if (quadraDeleted.userId !== userId) {
        return errorResponse(
          response,
          403,
          "Você não tem permissão para deletar esta quadra"
        );
      }

      await quadraModels.findByIdAndDelete(id);

      return response.status(200).json({
        message: "Sua quadra foi deletada com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao deletar quadra ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }

  async list(request, response) {
    try {
      const suasQuadras = await quadraModels.find({ userId: request.userId });

      if (!suasQuadras.length) {
        return errorResponse(response, 404, "Nenhuma quadra encontrada");
      }

      return response.status(200).json(suasQuadras);
    } catch (err) {
      console.error("Erro ao listar quadras ", err.message);
      return errorResponse(response, 500, "Falha ao realizar requisição");
    }
  }
}

export default new quadraControllers();
