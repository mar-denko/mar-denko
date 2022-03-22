import ApiClient from "../ApiClient";

const resource = "/v1/restaurants";
export default {
  getRestaurants() {
    return ApiClient.get(`${resource}`);
  },
  getRestaurantTables(restaurantId) {
    return ApiClient.get(`${resource}/${restaurantId}/tables`);
  },
};
