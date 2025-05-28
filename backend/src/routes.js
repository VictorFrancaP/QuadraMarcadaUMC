import { Router } from "express";
import usersControllers from "./controllers/usersControllers.js";
import { verifyToken } from "./middlewares/tokenVerify.js";
import { upload } from "./utils/multerConfig.js";
import quadraControllers from "./controllers/quadraControllers.js";
import proprietarioControllers from "./controllers/proprietarioControllers.js";
import { authorizeRoles } from "./middlewares/roleVerify.js";

const routes = Router();

routes.post("/cadastro/usuario", usersControllers.create);
routes.post("/cadastro/proprietario", proprietarioControllers.create);
routes.post("/login", usersControllers.login);
routes.delete("/deletar", verifyToken, usersControllers.delete);
routes.post("/forgot-password", usersControllers.forgotPassword);
routes.put("/reset-password/:token", usersControllers.resetPassword);
routes.get(
  "/profile",
  verifyToken,
  authorizeRoles("usuario", "proprietario", "admin"),
  usersControllers.profileUser
);
routes.put(
  "/profile/update",
  verifyToken,
  upload.single("fotoPerfil"),
  usersControllers.updateProfile
);
routes.post(
  "/quadra",
  verifyToken,
  upload.single("foto"),
  authorizeRoles("proprietario", "admin"),
  quadraControllers.create
);
export { routes };
