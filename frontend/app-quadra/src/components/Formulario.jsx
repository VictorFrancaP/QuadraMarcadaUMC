import { useState } from "react";
import styles from "../css/Formulario.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { IMaskInput } from "react-imask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Formulario = ({ type }) => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [email, setEmail] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [password, setPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cnpjError, setCnpjError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nomeError, setNomeError] = useState("");
  const [dataError, setDataError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [enderecoError, setEnderecoError] = useState("");
  const [cepError, setCepError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [popupIsVisible, setPopupIsVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telefoneRegex = /^(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
  const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
  const cnpjRegex = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;
  const navigate = useNavigate();

  const validarCpf = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, "");

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = 11 - (soma % 11);
    let digite1 = resto > 9 ? 0 : resto;

    if (parseInt(cpf.charAt(9)) !== digite1) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = 11 - (soma % 11);
    let digito2 = resto > 9 ? 0 : resto;

    return parseInt(cpf.charAt(10)) === digito2;
  };

  const validarCnpj = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
  };

  const validate = () => {
    let isValid = true;

    if (!nome) {
      setNomeError("O nome é obrigatório");
      isValid = false;
    } else if (nome.length < 3) {
      setNomeError("O nome deve conter três caracteres no minimo");
      isValid = false;
    }

    if (!data) {
      setDataError("A data de nascimento é obrigatória");
      isValid = false;
    } else {
      const hoje = new Date();
      const nascimento = new Date(data);
      const idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();

      if (
        idade < 13 ||
        (idade === 13 && mes < 0) ||
        (idade === 13 && mes === 0 && hoje.getDate() < nascimento.getDate())
      ) {
        setDataError("Você deve ter pelo menos 13 anos");
        isValid = false;
      } else if (nascimento > hoje) {
        setDataError("A data de nascimento não pode ser no futuro");
        isValid = false;
      } else {
        setDataError("");
      }
    }

    if (!cep) {
      setCepError("O cep é obrigatório");
      isValid = false;
    } else {
      setCepError("");
    }

    if (!email) {
      setEmailError("O e-mail é obrigatório");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("E-mail é inválido");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!endereco) {
      setEnderecoError("O endereço é obrigatório");
      isValid = false;
    } else if (endereco.length < 5) {
      setEnderecoError("O endereço deve conter cinco caracteres no minimo");
      isValid = false;
    } else if (endereco.trim().split(" ").length < 2) {
      setEnderecoError("O endereço deve conter pelo menos duas palavras");
      isValid = false;
    } else {
      setEnderecoError("");
    }

    if (!password) {
      setPasswordError("A senha é obrigatória");
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

    if (!telefone) {
      setTelefoneError("O telefone é obrigatório");
      isValid = false;
    } else if (!telefoneRegex.test(telefone)) {
      setTelefoneError("Formato de telefone inválido. Ex: (11) 91234-5678");
      isValid = false;
    } else {
      setTelefoneError("");
    }

    if (type === "proprietario") {
      if (!cnpj) {
        setCnpjError("O CNPJ é obrigatório");
        isValid = false;
      } else if (!cnpjRegex.test(cnpj)) {
        setCnpjError("Formato de CNPJ inválido");
        isValid = false;
      } else if (!validarCnpj(cnpj)) {
        setCnpjError("CNPJ incorreto");
        isValid = false;
      } else {
        setCnpjError("");
      }
    } else {
      if (!cpf) {
        setCpfError("O CPF é obrigatório");
        isValid = false;
      } else if (!cpfRegex.test(cpf)) {
        setCpfError("Formato de CPF inválido");
        isValid = false;
      } else if (!validarCpf(cpf)) {
        setCpfError("CPF incorreto");
        isValid = false;
      } else {
        setCpfError("");
      }
    }

    return isValid;
  };

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      if (response.data.erro) {
        setCepError("CEP não encontrado");
        setEndereco("");
      } else {
        setCepError("");
        const enderecoCompleto = `${response.data.logradouro}, ${response.data.bairro} - ${response.data.localidade}/${response.data.uf}`;
        setEndereco(enderecoCompleto);
      }
    } catch (err) {
      setCepError("Erro ao buscar CEP");
      setEndereco("");
      console.error("Falha ao carregar CEP ", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (type === "proprietario") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URLCADASTRO}`,
          {
            nome,
            data,
            email,
            cep,
            endereco,
            password,
            cnpj,
            telefone,
          }
        );
        setPopupMessage(response.data.message);
        setPopupIsVisible(true);
        setNome("");
        setData("");
        setEmail("");
        setCep("");
        setEndereco("");
        setPassword("");
        setConfirmPassword("");
        setCnpj("");
        setTelefone("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error("Erro ao cadastrar proprietario ", err.message);
        setPopupMessage(err.response.data.message);
        setPopupIsVisible(true);
      }
    } else if (type === "usuario") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_URLREGISTER}`,
          {
            nome,
            data,
            email,
            cep,
            endereco,
            password,
            cpf,
            telefone,
          }
        );
        setPopupMessage(response.data.message);
        setPopupIsVisible(true);
        setNome("");
        setData("");
        setEmail("");
        setCep("");
        setEndereco("");
        setPassword("");
        setConfirmPassword("");
        setCpf("");
        setTelefone("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error("Erro ao cadastrar usuario ", err.message);
        setPopupMessage(err.response.data.message);
        setPopupIsVisible(true);
      }
    }
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.backgroundShadow}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.texts}>
              <h1>Cadastre-se</h1>
              <p>Para se cadastrar digite suas informações abaixo.</p>
            </div>

            <div className={styles.formGroupContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Digite o seu nome aqui."
                  style={{ borderColor: nomeError ? "red" : "#ccc" }}
                />
                {nomeError && <span className={styles.error}>{nomeError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o seu e-mail aqui."
                  style={{ borderColor: emailError ? "red" : "#ccc" }}
                />
                {emailError && (
                  <span className={styles.error}>{emailError}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="data">Data de nascimento</label>
                <IMaskInput
                  mask="00/00/0000"
                  value={data}
                  onAccept={(value) => setData(value)}
                  placeholder="Digite a sua data de nascimento aqui."
                  style={{ borderColor: dataError ? "red" : "#ccc" }}
                />
                {dataError && <span className={styles.error}>{dataError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cep">CEP</label>
                <IMaskInput
                  mask="00000-000"
                  value={cep}
                  onAccept={(value) => setCep(value)}
                  onBlur={buscarCep}
                  placeholder="Digite o seu CEP aqui."
                  style={{ borderColor: cepError ? "red" : "#ccc" }}
                />
                {cepError && <span className={styles.error}>{cepError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endereco">Endereço</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  style={{ borderColor: enderecoError ? "red" : "#ccc" }}
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="telefone">Telefone</label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={telefone}
                  onAccept={(value) => setTelefone(value)}
                  placeholder="Digite o seu telefone aqui."
                  style={{ borderColor: telefoneError ? "red" : "#ccc" }}
                />
                {telefoneError && (
                  <span className={styles.error}>{telefoneError}</span>
                )}
              </div>

              {type === "usuario" && (
                <div className={styles.formGroup}>
                  <label htmlFor="cpf">CPF</label>
                  <IMaskInput
                    mask="000.000.000-00"
                    value={cpf}
                    onAccept={(value) => setCpf(value)}
                    placeholder="Digite o seu CPF aqui."
                    style={{ borderColor: cpfError ? "red" : "#ccc" }}
                  />
                  {cpfError && <span className={styles.error}>{cpfError}</span>}
                </div>
              )}

              {type === "proprietario" && (
                <div className={styles.formGroup}>
                  <label htmlFor="cnpj">CNPJ</label>
                  <IMaskInput
                    mask="00.000.000/0000-00"
                    value={cnpj}
                    onAccept={(value) => setCnpj(value)}
                    placeholder="Digite o seu CNPJ aqui."
                    style={{ borderColor: cnpjError ? "red" : "#ccc" }}
                  />
                  {cnpjError && (
                    <span className={styles.error}>{cnpjError}</span>
                  )}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="password">Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a sua senha aqui."
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
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme a sua senha aqui."
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

              <button type="submit" className={styles.buttonForm}>
                Cadastrar
              </button>
            </div>
            <Link className={styles.link} to="/login">
              Entrar
            </Link>
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

export default Formulario;
