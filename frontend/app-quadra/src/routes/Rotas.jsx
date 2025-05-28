import { Routes, Route, Navigate } from "react-router-dom";
import CadastroUsuario from "../pages/CadastroUsuario";
import CadastroProprietario from "../pages/CadastroProprietario";
import Inicio from "../pages/Inicio";
import Login from "../pages/Login";
import ProfileUser from "../pages/ProfileUser";
import RequestPassword from "../pages/RequestPassword";
import ResetPassword from "../pages/ResetPassword";
import Quadra from "../pages/QuadrasPages";
import { useAxiosInterceptor } from "../service/apiIntercept";
import UnauthorizedPage from "../components/NotAuthorized";

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error("Token inválido");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <>
        <UnauthorizedPage />
      </>
    );
  }

  return children;
};

const AppRoutes = () => {
  useAxiosInterceptor();
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
      <Route path="/cadastro/proprietario" element={<CadastroProprietario />} />
      <Route path="/login" element={<Login />} />
      <Route path="/esqueceuasenha?" element={<RequestPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <ProfileUser />
          </PrivateRoute>
        }
      />
      <Route
        path="/quadra"
        element={
          <PrivateRoute requiredRole="proprietario">
            <Quadra />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
