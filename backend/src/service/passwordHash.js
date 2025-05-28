import bcrypt from "bcrypt";

const saltRounds = 12;

const passwordHash = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

export { passwordHash };
