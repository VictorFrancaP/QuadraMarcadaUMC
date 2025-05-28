import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Popup from "./Popup";
import styles from "../css/Profile.module.css";
import { IMaskInput } from "react-imask";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const Profile = () => {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [cep, setCep] = useState("");
  const [nomeError, setNomeError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [dataError, setDataError] = useState("");
  const [cepError, setCepError] = useState("");
  const token = localStorage.getItem("token");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now());
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  console.log("user no render:", JSON.stringify(user, null, 2));

  const validate = () => {
    let isValid = true;

    if (!form.nome) {
      setNomeError("O nome é obrigatório");
      isValid = false;
    } else if (form.nome.trim().length < 3) {
      setNomeError("O nome deve conter três caracteres no minimo");
      isValid = false;
    } else {
      setNomeError("");
    }

    if (!form.data) {
      setDataError("A data de nascimento é obrigatória");
      isValid = false;
    } else {
      setDataError("");
    }

    if (!form.telefone) {
      setTelefoneError("O telefone é obrigatório");
      isValid = false;
    } else {
      setTelefoneError("");
    }

    return isValid;
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    const profileUrl = `http://localhost:3000/profile`;

    axios
      .get(profileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        setForm(response.data);
      })
      .catch((err) => console.error("Erro ao mostrar perfil ", err));
  }, [token, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    if (!selectedImage) return;

    const data = new FormData();
    data.append("fotoPerfil", selectedImage);

    try {
      const response = await axios.put(
        `http://localhost:3000/profile/update`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        fotoPerfil: response.data.fotoPerfil || prevUser.fotoPerfil,
      }));
      setImageTimestamp(Date.now());

      setPopupMessage("Imagem atualizada com sucesso");
      setPopupIsVisible(true);
      setImage(null);
    } catch (err) {
      console.error("Erro ao atualizar imagem", err.message);
      setPopupMessage("Erro ao atualizar imagem");
      setPopupIsVisible(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    for (const key in form) {
      data.append(key, String(form[key] ?? ""));
    }

    if (image) {
      data.append("fotoPerfil", image);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/profile/update`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPopupMessage(response.data.message);
      setPopupIsVisible(true);

      if (image) {
        setImageTimestamp(Date.now());
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil ", err.message);
      setPopupMessage(
        err.response?.data?.message || "Erro ao atualizar perfil"
      );
      setPopupIsVisible(true);
    }
  };

  const handleDelete = async () => {
    setShowConfirmDelete(false);
    try {
      const response = await axios.delete("http://localhost:3000/deletar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPopupMessage(response.data.message);
      setPopupIsVisible(true);
      localStorage.removeItem("token");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setPopupMessage(err.response.data.message);
      setPopupIsVisible(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setPopupMessage(
      "Espere um momento, estamos te redirecionando para a tela de login"
    );
    setPopupIsVisible(true);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const buscarCep = async (cepBusca) => {
    const cepLimpo = cepBusca.replace(/\D/g, "");

    if (!cepLimpo) {
      setCepError("O cep é obrigatório");
      setForm((prev) => ({ ...prev, endereco: "" }));
      return;
    } else if (cepLimpo.length !== 8) {
      setCepError("O cep deve conter 8 números");
      setForm((prev) => ({ ...prev, endereco: "" }));
      return;
    }

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (response.data.erro) {
        setCepError("CEP não encontrado");
        setForm((prev) => ({ ...prev, endereco: "" }));
      } else {
        setCepError("");
        const enderecoCompleto = `${response.data.logradouro}, ${response.data.bairro} - ${response.data.localidade}/${response.data.uf}`;
        setForm((prev) => ({
          ...prev,
          endereco: enderecoCompleto,
        }));
      }
    } catch (err) {
      setCepError("Erro ao buscar CEP");
      setForm((prev) => ({ ...prev, endereco: "" }));
      console.error("Falha ao carregar CEP ", err.message);
    }
  };

  useEffect(() => {
    if (cep && cep.replace(/\D/g, "").length === 8) {
      buscarCep(cep);
    }
  }, [cep]);

  return (
    <>
      <div className={styles.wrapper}>
        <button className={styles.buttonLogout} onClick={logout}>
          Sair
        </button>
        <div className={styles.container}>
          <div className={styles.profileImage}>
            <h1>Perfil</h1>
            <img
              src={`${import.meta.env.VITE_UPLOADS}${
                user.fotoPerfil || "default.png"
              }?t=${imageTimestamp}`}
              alt="Foto de perfil"
              width={150}
              style={{ borderRadius: "50%" }}
            />
          </div>
          <form
            onSubmit={handleSubmit}
            className={styles.form}
            encType="multipart/form-data"
          >
            <input
              className={styles.input}
              type="text"
              name="nome"
              value={form.nome || ""}
              onChange={handleChange}
              style={{ borderColor: nomeError ? "red" : "#ccc" }}
            />
            {nomeError && <span className={styles.error}>{nomeError}</span>}
            <IMaskInput
              className={styles.input}
              mask="00/00/0000"
              value={form.data || ""}
              onAccept={(value) => setForm({ ...form, data: value })}
              placeholder="Digite sua data de nascimento"
              style={{ borderColor: dataError ? "red" : "#ccc" }}
            />
            {dataError && <span className={styles.error}>{dataError}</span>}
            <IMaskInput
              className={styles.input}
              mask="(00) 00000-0000"
              value={form.telefone || ""}
              onAccept={(value) => setForm({ ...form, telefone: value })}
              placeholder="Digite seu telefone"
              style={{ borderColor: telefoneError ? "red" : "#ccc" }}
            />
            {telefoneError && (
              <span className={styles.error}>{telefoneError}</span>
            )}
            <IMaskInput
              className={styles.input}
              mask="00000-000"
              value={form.cep || ""}
              onAccept={(value) => {
                setForm((prev) => ({ ...prev, cep: value }));
                setCep(value);
              }}
              style={{ borderColor: cepError ? "red" : "#ccc" }}
              placeholder="Digite seu CEP"
            />
            {cepError && <span className={styles.error}>{cepError}</span>}
            <input
              className={styles.input}
              type="text"
              name="endereco"
              value={form.endereco || ""}
              readOnly
            />
            <label htmlFor="">Trocar Imagem</label>
            <input
              style={{ cursor: "pointer" }}
              className={styles.input}
              type="file"
              name="fotoPerfil"
              accept="image/*"
              onChange={handleImage}
            />
            <button type="submit">Atualizar</button>
          </form>
          {user.role && user.role === "proprietario" && (
            <button
              className={styles.buttonCadastrarQuadra}
              onClick={() => navigate("/quadra")}
            >
              Cadastrar Quadra
            </button>
          )}
          <button
            onClick={() => setShowConfirmDelete(true)}
            style={{ backgroundColor: "red", color: "#fff" }}
          >
            Excluir conta
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <Modal
          message="Tem certeza que deseja anonimizar sua conta?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}

      {popupIsVisible && (
        <Popup
          message={popupMessage}
          onClose={() => setPopupIsVisible(false)}
        />
      )}
    </>
  );
};

export default Profile;
