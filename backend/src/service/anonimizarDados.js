const anonimizarData = (user) => {
  (user.nome = null),
    (user.email = null),
    (user.endereco = null),
    (user.cep = null),
    (user.telefone = null),
    (user.cpf = null),
    (user.deleted = true);
  return user;
};

export { anonimizarData };
