// middlewares/authorizeRoles.js
import { errorResponse } from "../utils/errorResponse.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return errorResponse(res, 403, "Permissão negada!");
    }

    next();
  };
};

export { authorizeRoles };
