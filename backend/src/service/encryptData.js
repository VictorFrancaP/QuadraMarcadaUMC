import crypto from "crypto";
import "dotenv/config";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto.scryptSync(process.env.ENCRYPTION_SECRET, "salt", 32);

const encryptData = (data) => {
  if (typeof data !== "string") {
    throw new Error("Dados inválidos para criptografia: tipo deve ser string");
  }
  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);
  return IV.toString("hex") + ":" + encrypted.toString("hex");
};

export { encryptData };
