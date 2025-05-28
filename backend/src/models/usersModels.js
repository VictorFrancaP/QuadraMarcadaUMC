import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const usersSchema = new Schema({
  userId: ObjectId,
  nome: String,
  data: String,
  email: String,
  endereco: String,
  cep: String,
  telefone: String,
  password: String,

  cpf: { type: String, required: false },
  cnpj: { type: String, required: false },

  role: {
    type: String,
    enum: ["usuario", "proprietario", "admin"],
    default: "usuario",
    required: true,
  },
  resetToken: String,
  resetExpiredToken: Date,
  loginAttempts: { type: Number, default: 0 },
  lockAccount: { type: Number },
  fotoPerfil: {
    type: String,
    default: "default.png",
  },
});

usersSchema.pre("validate", function (next) {
  if (this.role === "usuario" && !this.cpf) {
    this.invalidate("cpf", "O CPF é obrigatorio para jogadores");
  }

  if (this.role === "proprietario" && !this.cnpj) {
    this.invalidate("cnpj", "O CNPJ é obrigatorio para proprietários");
  }

  next();
});

const usersModels = mongoose.model("userTable", usersSchema);

export { usersModels };
