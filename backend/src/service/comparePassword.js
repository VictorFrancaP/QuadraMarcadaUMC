import bcrypt from "bcrypt";

const compareHash = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export { compareHash };
