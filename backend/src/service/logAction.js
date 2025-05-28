import { logsModel } from "../models/logsModels.js";

const logAction = async ({
  userId = null,
  action,
  details = {},
  ip = null,
}) => {
  try {
    await logsModel.create({
      user: userId,
      action,
      details,
      ip,
    });
  } catch (err) {
    console.error("Erro ao salvar o log ", err.message);
  }
};

export { logAction };
