import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const quadraSchema = new Schema({
  quadraId: ObjectId,
  nome: String,
  tipoQuadra: String,
  capacidadePessoas: String,
  cep: String,
  endereco: String,
  nomeProprietario: String,
  telefone: String,
  valorQuadra: String,
  tipoEstacionamento: {
    type: Boolean,
    required: false,
  },
  foto: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userTable",
    required: true,
  },
});

const quadraModels = mongoose.model("quadraTable", quadraSchema);

export { quadraModels };
