import ApiClient from "../ApiClient";

const resource = "/v1/groups";
export default {
  getGroups() {
    return ApiClient.get(`${resource}`);
  },
  getGroup(groupId) {
    return ApiClient.get(`${resource}/${groupId}?includePositions=true`);
  },
};
