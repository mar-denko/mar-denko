import axios from "axios";
import auth from "./../Auth/AuthWorker.js";

function getToken() {
  const token =
    localStorage.getItem("auth_token") || localStorage.getItem("client_token");
  return function () {
    return token;
  };
}

const defaultHeaders = {
  Authorization: `Bearer ${getToken()()}`,
};

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_IP,
  headers: defaultHeaders,
});

instance.interceptors.request.use(
  async (config) => {
    let token = getToken()();
    if (token === null) {
      await auth.getClientToken();
      token = getToken()();
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    try {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        if (
          error.response.data.code === "invalid_auth_token" &&
          localStorage.getItem("auth_token")
        ) {
          await auth.logout();
        }
        if (
          error.response.data.code === "invalid_auth_token" &&
          !localStorage.getItem("auth_token")
        ) {
          originalRequest._retry = true;
          await auth.getClientToken();
          originalRequest.headers["Authorization"] = `Bearer ${getToken()()}`;
          return instance(originalRequest);
        }
        if (error.response.data.code === "auth_error") {
          alert("Сервис недоступен, попробуйте позже");
          await auth.logout();
        }
        if (error.response.data.code === "auth_token_expired") {
          originalRequest._retry = true;
          if (localStorage.getItem("auth_token"))
            return await auth
              .refreshToken()
              .then(() => {
                const token = getToken()();
                axios.defaults.headers.common["Authorization"] = token;
                originalRequest.headers["Authorization"] = token;
                if (originalRequest.data)
                  originalRequest.data = JSON.parse(originalRequest.data);
                return instance(originalRequest);
              })
              .catch(() => {
                return auth.logout();
              });
          else if (localStorage.getItem("client_token"))
            return await auth.getClientToken().then(() => {
              const token = getToken()();
              axios.defaults.headers.common["Authorization"] = token;
              originalRequest.headers["Authorization"] = token;
              if (originalRequest.data)
                originalRequest.data = JSON.parse(originalRequest.data);
              return instance(originalRequest);
            });
        }
      }
      if (error.response.status === 403) {
        if (error.response.data.code === "user_already_signed_up") {
          alert("Пользователь с таким именем уже зарегистрирован");
        }
        if (error.response.data.code === "auth_error") {
          alert("Сервис недоступен, попробуйте позже");
          await auth.logout();
        }
      }
      if (error.response.status === 404) {
        if (error.response.data.code === "auth_user_not_found") {
          return "continueSignUp";
        }
      }
      return Promise.reject(error);
    } catch (e) {
      console.log(e);
    }
  }
);

export default instance;
