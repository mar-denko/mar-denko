<template>
  <div class="sidebar-menu">
    <div
      id="mobile-burger"
      @click="$emit('toggleLayers', ['sidemenu'])"
      class="mobile-burger change"
    >
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
    </div>
    <ul class="sidebar-menu__list">
      <router-link
        :to="{
          name: 'Menu',
          params: {
            groupId: 1,
          },
          query: { openMenu: true },
        }"
        @click.native="$emit('toggleLayers', ['sidemenu'])"
        tag="li"
        >Меню</router-link
      >
      <router-link
        v-for="post in posts"
        :key="post.id"
        :to="{
          name: 'PostPage',
          params: {
            postId: post.id,
          },
        }"
        tag="li"
        >{{ post.title }}</router-link
      >
    </ul>
    <a class="sidebar-menu__link" href="tel:+78126007969">
      +7 (812) 600-79-29</a
    >
    <div class="sidebar-menu__social">
      <a href="https://www.instagram.com/pelmenya_spb/" target="_blank">
        <img alt="logo" src="@/assets/instagram.svg" />
      </a>
      <a href="https://vk.com/pelmenya.rest/" target="_blank">
        <img alt="logo" src="@/assets/vk.svg" />
      </a>
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
      posts: null,
    };
  },
  async created() {
    await this.getPosts();
  },
  methods: {
    async getPosts() {
      try {
        this.isLoading = true;
        const { data } = await posts.getPosts();
        this.posts = data
          .filter((x) => x.showAtMenu === true)
          .sort((a, b) => a.sortingNumber - b.sortingNumber);
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.mobile-burger > * {
  background-color: $pl-yellow;
}
.sidebar {
  &-menu {
    position: fixed;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    top: 0;
    right: 0;
    z-index: 102;
    padding: 16px 25px;
    background-color: $pl-red;
    @media (min-width: $viewport--md) {
      width: 500px;
    }
    &__link {
      color: $pl-yellow;
      font-weight: 600;
      text-decoration: none;
      margin-bottom: 14px;
    }
    &__social {
      margin-top: 14px;
      & *:not(:last-child) {
        margin-right: 14px;
      }
    }
    &__list {
      text-transform: uppercase;
      color: $pl-yellow;
      list-style-type: none;
      padding-inline-start: 0;
      margin-block-start: 0;
      margin-top: 24px;
      text-align: left;
      font-weight: 700;
      border-bottom: 1px solid $pl-yellow;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 10px;
      & * {
        width: fit-content;
        margin-bottom: 25px;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 1px;
        cursor: pointer;
      }
    }
  }
}
</style>
