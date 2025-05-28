import { useState, useEffect } from "react";
import Popup from "./Popup";
import styles from "../css/Quadra.module.css";
import { IMaskInput } from "react-imask";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Quadras = () => {
  const [form, setForm] = useState({
    nome: "",
    tipoQuadra: "",
    capacidadePessoas: "",
    cep: "",
    endereco: "",
    nomeProprietario: "",
    telefone: "",
    valorQuadra: "",
    tipoEstacionamento: "",
  });

  const [foto, setFoto] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [cep, setCep] = useState("");
  const regexNumeros = /^[0-9]+$/;
  const regexLetras = /^[A-Za-z0-9 ]+$/;
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    nome: "",
    tipoQuadra: "",
    capacidadePessoas: "",
    cep: "",
    endereco: "",
    nomeProprietario: "",
    telefone: "",
    valorQuadra: "",
    tipoEstacionamento: false,
  });

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!form.nome || form.nome.length < 7) {
      newErrors.nome = "O nome deve conter pelo menos 7 caracteres";
      isValid = false;
    } else if (!regexLetras.test(form.nome)) {
      newErrors.nome = "É permitido apenas letras";
      isValid = false;
    }

    if (!form.tipoQuadra) {
      newErrors.tipoQuadra = "O tipo de quadra é obrigatório";
      isValid = false;
    } else if (!regexLetras.test(form.tipoQuadra)) {
      newErrors.tipoQuadra = "É permitidos apenas letras";
      isValid = false;
    }

    if (!form.capacidadePessoas || parseInt(form.capacidadePessoas) < 8) {
      newErrors.capacidadePessoas = "Deve ser maior ou igual a 8";
      isValid = false;
    } else if (!regexNumeros.test(form.capacidadePessoas)) {
      newErrors.capacidadePessoas = "Apenas números são permitidos";
      isValid = false;
    }

    if (!form.cep) {
      newErrors.cep = "O CEP é obrigatório";
      isValid = false;
    }

    if (!form.endereco) {
      newErrors.endereco = "O endereço é obrigatório";
      isValid = false;
    }

    if (!form.nomeProprietario || form.nomeProprietario.length < 3) {
      newErrors.nomeProprietario = "Nome do proprietário inválido";
      isValid = false;
    } else if (!regexLetras.test(form.nomeProprietario)) {
      newErrors.nomeProprietario = "É permitido apenas letras";
      isValid = false;
    }

    if (!form.telefone) {
      newErrors.telefone = "O telefone é obrigatório";
      isValid = false;
    }

    if (!form.valorQuadra || parseFloat(form.valorQuadra) < 40) {
      newErrors.valorQuadra = "Valor inválido";
      isValid = false;
    } else if (!regexNumeros.test(form.valorQuadra)) {
      newErrors.valorQuadra = "Apenas números são permitidos";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (foto) formData.append("foto", foto);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3000/quadra",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setForm({
        nome: "",
        tipoQuadra: "",
        capacidadePessoas: "",
        cep: "",
        endereco: "",
        nomeProprietario: "",
        telefone: "",
        valorQuadra: "",
        tipoEstacionamento: false,
      });

      setTimeout(() => {
        navigate("/perfil");
      }, 2000);
      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
    } catch (err) {
      console.error("Erro ao cadastrar quadra:", err);
      setPopupMessage(err?.response?.data?.message || "Erro no servidor");
      setPopupIsVisible(true);
    }
  };

  const buscarCep = async (cepBusca) => {
    const cepLimpo = cepBusca.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setErrors((prev) => ({ ...prev, cep: "CEP deve conter 8 números" }));
      setForm((prev) => ({ ...prev, endereco: "" }));
      return;
    }

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (response.data.erro) {
        setErrors((prev) => ({ ...prev, cep: "CEP não encontrado" }));
        setForm((prev) => ({ ...prev, endereco: "" }));
      } else {
        setErrors((prev) => ({ ...prev, cep: "" }));
        const enderecoCompleto = `${response.data.logradouro}, ${response.data.bairro} - ${response.data.localidade}/${response.data.uf}`;
        setForm((prev) => ({ ...prev, endereco: enderecoCompleto }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, cep: "Erro ao buscar CEP" }));
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (cep.replace(/\D/g, "").length === 8) {
      buscarCep(cep);
    }
  }, [cep]);

  return (
    <>
      <div className={styles.wrapper}>
        <button
          className={styles.buttonPerfil}
          onClick={() => navigate("/perfil")}
        >
          Voltar para perfil
        </button>
        <div className={styles.container}>
          <form onSubmit={handleSubmit}>
            <div className={styles.texts}>
              <h1>Cadastrar Quadra</h1>
              <p>Insira as informações abaixo para efetuar o cadastro</p>
            </div>
            <div className={styles.formGroupContainer}>
              <div className={styles.formGroup}>
                <label>Nome do Local</label>
                <input
                  name="nome"
                  type="text"
                  value={form.nome}
                  onChange={handleChange}
                  style={{ borderColor: errors.nome ? "red" : "#ccc" }}
                />
                {errors.nome && (
                  <span className={styles.error}>{errors.nome}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Tipo de Quadra</label>
                <input
                  name="tipoQuadra"
                  type="text"
                  value={form.tipoQuadra}
                  onChange={handleChange}
                  style={{ borderColor: errors.tipoQuadra ? "red" : "#ccc" }}
                />
                {errors.tipoQuadra && (
                  <span className={styles.error}>{errors.tipoQuadra}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Capacidade</label>
                <input
                  name="capacidadePessoas"
                  type="text"
                  value={form.capacidadePessoas}
                  onChange={handleChange}
                  style={{
                    borderColor: errors.capacidadePessoas ? "red" : "#ccc",
                  }}
                />
                {errors.capacidadePessoas && (
                  <span className={styles.error}>
                    {errors.capacidadePessoas}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>CEP</label>
                <IMaskInput
                  mask="00000-000"
                  value={form.cep}
                  onAccept={(value) => {
                    setForm((prev) => ({ ...prev, cep: value }));
                    setCep(value);
                  }}
                  style={{ borderColor: errors.cep ? "red" : "#ccc" }}
                />
                {errors.cep && (
                  <span className={styles.error}>{errors.cep}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Endereço</label>
                <input name="endereco" value={form.endereco} readOnly />
                {errors.endereco && (
                  <span className={styles.error}>{errors.endereco}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Nome Proprietário</label>
                <input
                  name="nomeProprietario"
                  value={form.nomeProprietario}
                  onChange={handleChange}
                  style={{
                    borderColor: errors.nomeProprietario ? "red" : "#ccc",
                  }}
                />
                {errors.nomeProprietario && (
                  <span className={styles.error}>
                    {errors.nomeProprietario}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Telefone</label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={form.telefone}
                  onAccept={(value) => setForm({ ...form, telefone: value })}
                  style={{ borderColor: errors.telefone ? "red" : "#ccc" }}
                />
                {errors.telefone && (
                  <span className={styles.error}>{errors.telefone}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>Valor da Quadra</label>
                <input
                  name="valorQuadra"
                  type="text"
                  value={form.valorQuadra}
                  onChange={handleChange}
                  style={{ borderColor: errors.valorQuadra ? "red" : "#ccc" }}
                />
                {errors.valorQuadra && (
                  <span className={styles.error}>{errors.valorQuadra}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxGroup}>
                  <label htmlFor="tipoEstacionamento">Estacionamento</label>
                  <input
                    name="tipoEstacionamento"
                    type="checkbox"
                    checked={form.tipoEstacionamento}
                    onChange={(e) =>
                      setForm({ ...form, tipoEstacionamento: e.target.checked })
                    }
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit">Cadastrar Quadra</button>
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

export default Quadras;
