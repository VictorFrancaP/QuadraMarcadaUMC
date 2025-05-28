# ⚽ Quadra Marcada — Sistema de Aluguel de Quadras Esportivas


<p>
  <a href="(https://github.com/VictorFrancaP/QuadraMarcadaUMC/blob/main/images/logo%20quadra%20marcada.png)">
    <img src="images/logo quadra marcada.png" alt="QUADRA_MARCADA_LOGO">
  </a>
</p>

## 📜 Descrição do Projeto

O **Quadra Marcada** é uma aplicação web desenvolvida para facilitar o processo de aluguel de quadras esportivas. A plataforma conecta jogadores que buscam locais para suas partidas e os proprietários que possuem quadras disponíveis. 

Esse projeto foi desenvolvido em trio, sendo:

- [Leonardo Tavares](https://github.com/LeonardoTavDev14)
- [Ryan Gustavo Valentim](https://github.com/ryangvdelima)
- [Victor Hugo França](https://github.com/VictorFrancaP)

### 🚩 **Resolvemos**
- Dificuldade em encontrar quadras disponíveis;
- Falta de centralização nas reservas, que geralmente são feitas via telefone ou WhatsApp;
- Falta de comunicação estruturada entre jogadores e locadores de quadras.

### 🎯 **Objetivos**
- Permitir reservas online de quadras de forma simples e rápida;
- Gerenciar perfis de usuários (jogadores) e proprietários de quadras;
- Facilitar pagamentos e controle de reservas pela própria plataforma.

## 🚀 Instruções de Instalação e Uso

### 🔧 **Tecnologias Utilizadas**
- Backend: Node.js + Express
- Frontend: ReactJS
- Banco de Dados: MongoDB
- Ambiente de desenvolvimento: Visual Studio Code / MongoDB

### ⚙️ **Instalação**

1. Clone o repositório:

```bash
git clone https://github.com/victorfrancap/bolamarcada.git
```

2. Instale as dependências do backend:

```bash
cd backend
npm install
```

3. Instale as dependências do frontend:

```bash
cd frontend
npm install
```

4. Configure o banco de dados MySQL:

- Crie o banco com o script SQL disponível no arquivo `/database/script.sql`.

5. Crie um arquivo `.env` na raiz do backend com as seguintes informações:

```
PORT=3000
SECRET_KEY=
DATABASE=
USERDB=
CLIENT_URL=
EMAIL_USER=
PASSWORD_USER=
ENCRYPTION_SECRET=
REFRESH_TOKEN_SECRET=
```

6. Execute o backend:

```bash
npm run dev
```

7. Execute o frontend:

```bash
npm run dev
```

### ✅ **Pronto! Acesse:**

```
http://localhost:3000
```

## 🤝 Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'Adicionando minha feature'`
4. Faça push para a branch: `git push origin minha-feature`
5. Abra um Pull Request.

### 🐛 **Relatar Bugs ou Sugestões**
- Abra uma issue no repositório com detalhes claros e objetivos.

## 🔗 Informações Importantes da API

### 🔑 **Autenticação**
- Sistema de autenticação JWT com **Access Token** e **Refresh Token**.

### 🛠️ **Principais Endpoints**

| Método | Rota                | Descrição                             |
|--------|---------------------|---------------------------------------|
| POST   | `/login`            | Autenticação e geração de tokens      |
| POST   | `/cadastro`         | Cadastro de usuário ou proprietário   |
| GET    | `/quadras`          | Lista quadras disponíveis             |
| POST   | `/quadras`          | Cadastrar quadra                      |
| PUT    | `/quadras/:id`      | Atualizar quadra                      |
| DELETE | `/quadras/:id`      | Deletar quadra                        |
| POST   | `/refresh`          | Gerar novo Access Token               |
| POST   | `/forgot-password`  | Enviar token para recuperar senha     |
| POST   | `/reset-password`   | Redefinir senha usando token          |

### 🔐 **Segurança**
- Senhas são armazenadas com hash (bcrypt).
- Tokens JWT utilizados para autenticação e renovação segura.
- Dados em conformidade com a **LGPD (Lei Geral de Proteção de Dados)**.

## 🏗️ Estrutura do Projeto

```
/backend
  ├──src
      ├── controllers
      ├── loaders
      ├── middlewares
      ├── models
      ├── utils
      ├── app.js
      ├── services
      ├── routes.js
      └── server.js
/frontend
  ├── public
  ├── src
      ├── assets
      ├── components
      ├── css
      ├── pages
      ├── routes
      ├── service
      ├── App.jsx
      ├── index.css
      └── main.jsx
```

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
Realizado em Mogi das Cruzes, São Paulo.
