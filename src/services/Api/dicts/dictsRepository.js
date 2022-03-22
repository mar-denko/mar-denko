import ApiClient from "../ApiClient";

const resource = "/v1";
export default {
  getReceiveTypes() {
    return ApiClient.get(`${resource}/receiveTypes`);
  },
  getMeasures() {
    return ApiClient.get(`${resource}/measures`);
  },
  getDeliveryZoneTypes() {
    return ApiClient.get(`${resource}/deliveryZoneTypes`);
  },
  getTillypadMenu() {
    return ApiClient.get(`${resource}/menuItems`);
  },
};
