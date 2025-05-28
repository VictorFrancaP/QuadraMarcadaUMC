import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../css/Login.module.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Popup from "../components/Popup";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;

    if (!password) {
      setPasswordError("Senha é obrigatória");
      isValid = false;
    } else if (password.length < 7) {
      setPasswordError("A senha deve conter sete caracteres no minimo");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirmar senha é obrigatório");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("As senhas não coincidem");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URLRESETPASSWORD}/${token}`,
        {
          password,
        }
      );
      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro ao redefinir a senha ", err.message);
      setPopupMessage(err.response.data.message);
      setPopupIsVisible(true);
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <form onSubmit={handleSubmit}>
            <div className={styles.texts}>
              <h1>Redefinir Senha</h1>
              <p>Insira a nova senha abaixo</p>
            </div>

            <div className={styles.formGroupContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a sua nova senha aqui."
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

              <div className={styles.formGroup}>
                <label htmlFor="password">Confirmar Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha aqui."
                    style={{
                      borderColor: confirmPasswordError ? "red" : "#ccc",
                    }}
                  />
                  <span
                    className={styles.passwordSpan}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
                {confirmPasswordError && (
                  <span className={styles.error}>{confirmPasswordError}</span>
                )}
              </div>

              <button type="submit">Redefinir</button>
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

export default ResetPassword;
