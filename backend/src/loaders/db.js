import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USERDB}:${process.env.PASSWORD_DB}@${process.env.DATABASE}.mc2wmug.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DATABASE}`
    );
    console.log("Conexão com o banco de dados realizada com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar com o banco de dados ", err.message);
  }
};

export { connectionDB };
