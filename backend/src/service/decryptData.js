import crypto from "crypto";
import "dotenv/config";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto.scryptSync(process.env.ENCRYPTION_SECRET, "salt", 32);

const decryptData = (encryptData) => {
  const [ivHex, encryptHex] = encryptData.split(":");
  const ivBuffer = Buffer.from(ivHex, "hex");
  const encryptBuffer = Buffer.from(encryptHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, ivBuffer);
  const decrypt = Buffer.concat([
    decipher.update(encryptBuffer),
    decipher.final(),
  ]);
  return decrypt.toString("utf8");
};

export { decryptData };
