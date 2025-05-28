import React from "react";
import styles from "../css/UnauthorizedPage.module.css";

const UnauthorizedPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          403 - Você não tem permissão para acessar esta rota
        </h1>
        <p className={styles.message}>
          Você não tem permissão para acessar esta página.
        </p>
        <a href="/perfil" className={styles.button}>
          Voltar para o Perfil
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
