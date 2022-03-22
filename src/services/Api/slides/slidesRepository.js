import ApiClient from "../ApiClient";

const resource = "/v1/slides";
export default {
  getSlides() {
    return ApiClient.get(`${resource}`);
  },
};
