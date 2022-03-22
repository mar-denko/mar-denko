import ApiClient from "../ApiClient";

const resource = "/v1/users";
export default {
  createUser(payload) {
    return ApiClient.post(`${resource}`, payload);
  },
  getUserOwn() {
    return ApiClient.get(`${resource}/own`);
  },
  updateUserOwn(payload) {
    return ApiClient.put(`${resource}/own`, payload);
  },
  getUsersBonusHistory() {
    return ApiClient.get(`${resource}/own/accountHistory`);
  },
  getUserAddresses() {
    return ApiClient.get(`${resource}/own/addresses`);
  },
  createUserAddress(payload) {
    return ApiClient.post(`${resource}/own/addresses`, payload);
  },
  updateUserAddress(addressId, payload) {
    return ApiClient.put(`${resource}/own/addresses/${addressId}`, payload);
  },
  removeUserAddress(addressId) {
    return ApiClient.delete(`${resource}/own/addresses/${addressId}`);
  },
};
