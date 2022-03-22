import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { AuthFactory } from "./AuthFactory.js";
const auth = AuthFactory.get("auth");

const crypto = require("crypto");

function AuthData() {
  const clientID = process.env.VUE_APP_CLIENT_ID;
  const client_secret = process.env.VUE_APP_CLIENT_SECRET;

  return function getClient() {
    return { clientID: clientID, client_secret: client_secret };
  };
}

async function cryptData(data) {
  try {
    if (data.credentials.password) {
      const saltedPassword = data.credentials.password + data.salt;
      data.credentials.password = crypto
        .createHash("sha1")
        .update(saltedPassword)
        .digest("hex");
    }
    const key = await auth.getPublicKey(data.client_id);
    let buffer = Buffer.from(JSON.stringify(data.credentials));
    data.credentials = crypto.publicEncrypt(key.data.public_key, buffer);
    data.credentials = data.credentials.toString("base64");
    return data.credentials;
  } catch (e) {
    AuthErrorCatcher(e);
  }
}

async function getFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const visitorId = result.visitorId;
  return visitorId;
}

function AuthErrorCatcher(error) {
  if (error.response.status === 400) {
    if (
      error.response.data.user_alert_message ===
      "User with this email already exists"
    )
      return "userAlreadyExist";
    if (error.config.url !== "/signUp") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("client_token");
    }
  }
  if (error.response.status === 401) {
    if (
      error.response.data.error_description ===
      "Wrong username or password provided"
    )
      return "passwordError";
  }
  if (error.response.status === 404) {
    if (error.response.data.error_description === "User is not found")
      return "userNotFound";
    if (
      error.response.data.error_description ===
        "Incorrect confirmation code!" ||
      error.response.data.error_description === "Invalid code!"
    )
      alert("Некорректный код подтверждения\nПопробуйте получить код еще раз");
  }
  if (error.response.status === 500) {
    alert("Сервер не отвечает, попробуйте позже");
  }
}

export default {
  async getClientToken() {
    try {
      const data = {
        client_id: AuthData()().clientID,
        grant_type: "client_credentials",
        credentials: {
          client_secret: AuthData()().client_secret,
        },
      };
      data.credentials = await cryptData(data);
      const result = await auth.getToken(data);
      localStorage.setItem("client_token", result.data.access_token);
      return true;
    } catch (e) {
      localStorage.removeItem("client_token");
      AuthErrorCatcher(e);
      return false;
    }
  },
  async signUp(formData) {
    try {
      const data = {
        client_id: AuthData()().clientID,
        grant_type: "registration",
        salt: null,
        credentials: {
          client_secret: AuthData()().client_secret,
          username: formData.username,
          password: formData.password,
        },
      };
      data.salt = crypto.randomBytes(12).toString("base64");
      data.credentials = await cryptData(data);
      return await auth.postSignUp(data);
    } catch (e) {
      let error = AuthErrorCatcher(e);
      return error;
    }
  },
  async verifyToken() {
    try {
      let token = localStorage.getItem("auth_token");
      return await auth.verifyToken(token);
    } catch (e) {
      AuthErrorCatcher(e);
    }
  },
  async requestConfirmUserCode() {
    try {
      let token = localStorage.getItem("auth_token");
      return await auth.requestConfirmUserCode({
        client_id: AuthData()().clientID,
        access_token: token,
      });
    } catch (e) {
      AuthErrorCatcher(e);
    }
  },
  async confirmUser(data) {
    try {
      return await auth.confirmUser(data);
    } catch (e) {
      AuthErrorCatcher(e);
    }
  },
  async signIn(formData) {
    try {
      const data = {
        client_id: AuthData()().clientID,
        grant_type: "password",
        salt: null,
        fingerprint: "",
        need_refresh: true,
        credentials: {
          client_secret: AuthData()().client_secret,
          username: formData.username,
          password: formData.password,
        },
      };
      const saltResponse = await auth.getSalt(data.credentials.username);
      data.salt = saltResponse.data.salt;
      data.fingerprint = await getFingerprint();
      data.credentials = await cryptData(data);
      const result = await auth.getToken(data);
      localStorage.setItem("auth_token", result.data.access_token);
      return true;
    } catch (e) {
      localStorage.removeItem("auth_token");
      let error = AuthErrorCatcher(e);
      return error;
    }
  },
  async adminRecovery(formData) {
    try {
      let token = localStorage.getItem("auth_token");
      let data = {
        client_id: AuthData()().clientID,
        grant_type: "registration",
        username: formData,
        support_recovery: true,
        access_token: token,
      };
      await auth.recovery(data);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  async recovery(formData) {
    try {
      const data = {
        client_id: AuthData()().clientID,
        grant_type: "registration",
        username: formData,
      };
      await auth.recovery(data);
      return true;
    } catch (e) {
      let error = AuthErrorCatcher(e);
      return error;
    }
  },
  async recoveryConfirm(formData) {
    try {
      const { data } = await auth.confirmRecovery(formData);
      localStorage.setItem("recovery_data", JSON.stringify(data));
      return true;
    } catch (e) {
      AuthErrorCatcher(e);
      return false;
    }
  },
  async newPassword(hash, salt, formData) {
    try {
      const data = {
        client_id: AuthData()().clientID,
        grant_type: "registration",
        salt: salt,
        credentials: {
          client_secret: AuthData()().client_secret,
          username: formData.username,
          password: formData.password,
        },
      };
      /* data.salt = crypto.randomBytes(12).toString("base64"); */
      data.credentials = await cryptData(data);
      return await auth.newPassword(hash, data);
    } catch (e) {
      AuthErrorCatcher(e);
    }
  },
  async refreshToken() {
    try {
      const data = {
        client_id: AuthData()().clientID,
        grant_type: "refresh_token",
        fingerprint: "",
        credentials: {
          client_secret: AuthData()().client_secret,
        },
      };
      data.fingerprint = await getFingerprint();
      data.credentials = await cryptData(data);
      const result = await auth.getToken(data);
      if (result.data.access_token)
        localStorage.setItem("auth_token", result.data.access_token);
      return true;
    } catch (e) {
      AuthErrorCatcher(e);
      return false;
    }
  },
  async logout() {
    try {
      const data = {
        client_id: AuthData()().clientID,
        access_token: localStorage.getItem("auth_token"),
      };

      await auth.postLogOut(data);
      localStorage.removeItem("auth_token");
      return true;
    } catch (e) {
      AuthErrorCatcher(e);
    }
  },
};
