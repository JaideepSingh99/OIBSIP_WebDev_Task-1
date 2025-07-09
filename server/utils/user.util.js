export const sanitizeUser = (user) => {
  const {
    password,
    ...safeUser
  } = user;

  return safeUser;
};