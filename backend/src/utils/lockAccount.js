const lockAccount = (user) => {
  return user.lockAccount && user.lockAccount > Date.now();
};

export { lockAccount };
