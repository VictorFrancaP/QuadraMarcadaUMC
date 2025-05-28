import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/errorResponse.js";
import "dotenv/config.js";

const verifyToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(response, 403, "Token não encontrado ou formatado!");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return errorResponse(
        response,
        401,
        "Token inválido ou expirado, recarregue a pagina"
      );
    }

    request.userId = decoded.userId;
    request.userRole = decoded.role;

    next();
  });
};

export { verifyToken };
