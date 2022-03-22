import authRepository from "./AuthRepository.js";

const repositories = {
  auth: authRepository,
};

export const AuthFactory = {
  get: (name) => repositories[name],
};
