import ApiClient from "../ApiClient";

const resource = "/v1/orders";
export default {
  createOrder(payload) {
    return ApiClient.post(`${resource}`, payload);
  },
};
