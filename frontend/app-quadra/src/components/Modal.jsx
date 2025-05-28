import React from "react";
import styles from "../css/Modal.module.css";

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div>
          <button onClick={onConfirm} className={styles.confirm}>
            Sim
          </button>
          <button onClick={onCancel} className={styles.cancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
