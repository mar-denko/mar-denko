import AuthClient from "./AuthClient";

export default {
  getPublicKey(clientID) {
    return AuthClient.get(`public-key/${clientID}`);
  },
  postSignUp(payload) {
    return AuthClient.post(`/signUp`, payload);
  },
  getSalt(username) {
    return AuthClient.get(`/salt/${username}/`);
  },
  getToken(payload) {
    return AuthClient.post(`/token`, payload);
  },
  verifyToken(token) {
    return AuthClient.get(`/token/verify?access_token=${token}`);
  },
  postLogOut(payload) {
    return AuthClient.post(`/token/logout`, payload);
  },
  recovery(payload) {
    return AuthClient.post(`/password/recovery`, payload);
  },
  confirmRecovery(payload) {
    return AuthClient.post(`/password/recovery/confirm`, payload);
  },
  newPassword(hash, payload) {
    return AuthClient.post(`/password/recovery/confirm/${hash}/`, payload);
  },
  confirmUser(payload) {
    return AuthClient.post(`/registration/confirm`, payload);
  },
  requestConfirmUserCode(payload) {
    return AuthClient.post(`/registration/confirm/email-request`, payload);
  },
};
