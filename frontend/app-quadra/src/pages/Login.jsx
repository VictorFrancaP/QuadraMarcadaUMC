import { useState } from "react";
import axios from "axios";
import styles from "../css/Login.module.css";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;

    if (!email) {
      setEmailError("O e-mail é obrigatório");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Insira um e-mail válido");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("A senha é obrigatória");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_URLLOGIN}`, {
        email,
        password,
      });

      const token = response.data.token;
      const role = response.data.user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      setEmail("");
      setPassword("");
      setTimeout(() => {
        navigate("/perfil");
      }, 2000);
    } catch (err) {
      setPopupMessage(err.response?.data?.message || "Erro desconhecido");
      setPopupIsVisible(true);
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit}>
            <div className={styles.texts}>
              <h1>Realizar Login</h1>
              <p>Insira as informações abaixo para efetuar o login</p>
            </div>

            <div className={styles.formGroupContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o seu e-mail aqui"
                  style={{ borderColor: emailError ? "red" : "#ccc" }}
                />
                {emailError && (
                  <span className={styles.error}>{emailError}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a sua senha aqui"
                    style={{ borderColor: passwordError ? "red" : "#ccc" }}
                  />
                  <span
                    className={styles.passwordSpan}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
                {passwordError && (
                  <span className={styles.error}>{passwordError}</span>
                )}
              </div>

              <button type="submit">Logar</button>
            </div>

            <div className={styles.links}>
              <Link className={styles.link} to="/">
                Cadastre-se
              </Link>

              <Link className={styles.link} to="/esqueceuasenha?">
                Esqueceu a senha?
              </Link>
            </div>
          </form>
        </div>
      </div>

      {popupIsVisible && (
        <Popup
          message={popupMessage}
          onClose={() => setPopupIsVisible(false)}
        />
      )}
    </>
  );
};

export default Login;
