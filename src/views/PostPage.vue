<template>
  <div class="postPage">
    <div v-if="post !== null" class="page-wrapper">
      <div class="postPage__line-top">
        <img
          class="postPage__line-top--back"
          src="@/assets/icons/arrow-left.svg"
          @click="$router.go(-1)"
        />
        <h2>{{ post.title }}</h2>
        <div></div>
      </div>
      <div class="postPage__line-middle">
        <p class="post__text">{{ post.descriptionFull }}</p>
        <template v-if="post.imagesFull.length > 0">
          <img
            v-for="(image, j) in post.imagesFull"
            :key="j"
            v-lazy="image"
            class="post__image"
          />
        </template>
      </div>
      <div class="postPage__line-bottom">
        <div v-if="post.videoUrl" class="post__video">
          <LazyYoutube :src="post.videoUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const posts = DataFactory.get("posts");

export default {
  name: "Home",
  data() {
    return {
      post: null,
    };
  },
  async created() {
    await this.getPost();
  },
  watch: {
    $route() {
      this.getPost();
    },
  },
  methods: {
    async getPost() {
      try {
        this.isLoading = true;
        const { data } = await posts.getPost(this.$route.params.postId);
        this.post = data;
        for (let i = 0; i < this.post.imagesFull.length; i++) {
          this.post.imagesFull[
            i
          ] = `${this.$store.state.baseURL}${this.post.imagesFull[i]}`;
        }
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
