import ApiClient from "../ApiClient";

const resource = "/v1/positions";
export default {
  getPositions(groupId) {
    return ApiClient.get(
      `${resource}?groupId=${groupId}&includePositions=true`
    );
  },
  getPosition(positionId) {
    return ApiClient.get(`${resource}/${positionId}`);
  },
};
