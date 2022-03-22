import ApiClient from "../ApiClient";

const resource = "/v1/posts";
export default {
  getPosts() {
    return ApiClient.get(`${resource}`);
  },
  getPost(postId) {
    return ApiClient.get(`${resource}/${postId}`);
  },
};
