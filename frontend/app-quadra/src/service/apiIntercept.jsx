import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const api = axios.create({
  baseURL: "http://suaapi.com",
});

export function useAxiosInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
}

export default api;
