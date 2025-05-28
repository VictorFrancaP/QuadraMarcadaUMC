import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/Login.module.css";
import Popup from "../components/Popup";
import axios from "axios";

const RequestPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
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

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URLFORGOTPASSWORD}`,
        {
          email,
        }
      );
      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      setEmail("");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Erro ao solicitar redefinição de senha ", err.message);
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
              <h1>Solicitar Nova Senha</h1>
              <p>
                Insira o seu e-mail cadastrado abaixo para redefinir sua senha
              </p>
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

              <button type="submit">Enviar</button>
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

export default RequestPassword;
