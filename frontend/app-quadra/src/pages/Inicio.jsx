import styles from "../css/Inicio.module.css";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const navigate = useNavigate();

  const typeRole = (role) => {
    navigate(`/cadastro/${role}`);
  };

  return (
    <>
      <div className={styles.containerInicio}>
        <div className={styles.container}>
          <div className={styles.containerTexts}>
            <h1>Bem-vindo à nossa plataforma</h1>
            <p>Qual tipo de usuário você seria:</p>
          </div>
          <div className={styles.containerButtons}>
            <button
              className={styles.buttonOne}
              onClick={() => typeRole("usuario")}
            >
              Sou jogador
            </button>
            <button
              className={styles.buttonTwo}
              onClick={() => typeRole("proprietario")}
            >
              Sou proprietario
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inicio;
