<template>
  <div class="home">
    <VueSlickCarousel
      v-if="slidesMobile.length > 0 || slidesPc.length > 0"
      :arrows="false"
      :dots="true"
      :adaptiveHeight="true"
    >
      <template v-if="windowWidth < 768 && slidesMobile.length > 0">
        <img
          v-for="(img, i) in slidesMobile"
          class="slider-image"
          draggable="false"
          :key="i"
          v-lazy="img"
        />
      </template>
      <template v-if="windowWidth >= 768 && slidesPc.length > 0">
        <img
          v-for="(img, i) in slidesPc"
          class="slider-image"
          draggable="false"
          :key="i"
          v-lazy="img"
        />
      </template>
    </VueSlickCarousel>
    <div class="menu">
      <div class="menu-wrapper">
        <h2 class="menu__title"></h2>
        <div v-if="groups !== null" class="menu__wrapper">
          <router-link
            v-for="(item, i) in groups"
            :key="i"
            :to="{
              name: 'Menu',
              params: {
                groupId: item.id,
              },
            }"
            tag="div"
            class="menu__item"
            >{{ item.name }}</router-link
          >
        </div>
      </div>
    </div>
    <div v-if="posts !== null && posts.length > 0" class="posts">
      <div
        @click="redirectToPostPage(post)"
        class="post"
        v-for="(post, i) in posts"
        :key="i"
      >
        <div class="post-wrapper">
          <span
            :class="{ 'post--clickable': post.clickable }"
            class="post__title"
            >{{ post.title }}</span
          >
          <p :class="{ 'post--clickable': post.clickable }" class="post__text">
            {{ post.description }}
          </p>
          <template v-if="post.images.length > 0">
            <img
              v-for="(image, j) in post.images"
              :key="j"
              v-lazy="image"
              class="post__image"
            />
          </template>
          <div v-if="post.videoUrl" class="post__video">
            <LazyYoutube :src="post.videoUrl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const groups = DataFactory.get("groups");
const posts = DataFactory.get("posts");
const slides = DataFactory.get("slides");

import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";

export default {
  name: "Home",
  components: { VueSlickCarousel },
  data() {
    return {
      windowWidth: window.innerWidth,
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
        },
      },
      slidesList: [],
      slidesPc: [],
      slidesMobile: [],
      posts: null,
      groups: null,
    };
  },
  async created() {
    await this.getSlides();
    await this.getGroups();
    await this.getPosts();
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    redirectToPostPage(post) {
      if (post.clickable)
        this.$router.push({
          name: "PostPage",
          params: {
            postId: post.id,
          },
        });
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    async getGroups() {
      try {
        this.isLoading = true;
        const { data } = await groups.getGroups();
        this.groups = data.sort((a, b) => a.sortingNumber - b.sortingNumber);
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async getSlides() {
      try {
        this.isLoading = true;
        const { data } = await slides.getSlides();
        this.slidesList = data.sort((a, b) => a.id - b.id);
        this.slidesList.forEach(async (slide) => {
          if (slide.imagePc)
            this.slidesPc.push(`${this.$store.state.baseURL}${slide.imagePc}`);
          if (slide.imageMobile)
            this.slidesMobile.push(
              `${this.$store.state.baseURL}${slide.imageMobile}`
            );
        });
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async getPosts() {
      try {
        this.isLoading = true;
        const { data } = await posts.getPosts();
        this.posts = data.sort((a, b) => a.sortingNumber - b.sortingNumber);
        this.isLoading = false;
        for (let i = 0; i < this.posts.length; i++) {
          for (let j = 0; j < this.posts[i].images.length; j++) {
            this.posts[i].images[
              j
            ] = `${this.$store.state.baseURL}${this.posts[i].images[j]}`;
          }
        }
        this.$forceUpdate();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";
.slider-image {
  user-drag: none;
  user-select: none;
}
.posts {
  width: 100%;
  background: $pl-gray;
  color: $pl-yellow;
  display: flex;
  flex-direction: column;
  .post {
    border-top: 1px solid $pl-yellow;
    padding: 22px 0;
    width: 90%;
    margin: 0 auto;

    @media (min-width: $viewport--md) {
      &:nth-child(even) {
        .post-wrapper {
          float: right;
        }
      }
    }
    @media (min-width: $viewport--md) {
      width: 95%;
    }
    @media (min-width: $viewport--xl) {
      width: 1100px;
    }

    &-wrapper {
      @media (min-width: $viewport--md) {
        width: 60%;
      }
    }
    &--clickable:hover {
      cursor: pointer;
      text-decoration: underline;
    }
    &__title {
      font-weight: 300;
      font-size: 36px;
      line-height: 49px;
      text-transform: capitalize;
    }
    &__text {
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      word-wrap: break-word;
      white-space: pre-line;
    }
    &__image {
      width: 100%;
      height: auto;
      margin-block-end: 1em;
    }
  }

  iframe {
    width: 100%;
  }
}
.menu {
  background-color: $pl-gray;

  &-wrapper {
    width: 90%;
    background-color: $pl-gray;
    margin: 0 auto;
    @media (min-width: $viewport--md) {
      width: 95%;
    }
    @media (min-width: $viewport--xl) {
      width: 1100px;
    }
  }
  &__title {
    width: 100%;
    margin: 0;
    padding: 20px 0;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 0.1em;
    text-decoration: underline;
    text-align: center;
    color: $pl-yellow;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    &::after {
      content: "";
      flex: auto;
    }
    @media (min-width: $viewport--md) {
      justify-content: flex-start;
      gap: 2%;
      @supports not (gap: 2%) {
        & > * {
          margin: 0.5em;
        }
      }
    }
  }
  &__item {
    width: 49%;
    color: $pl-yellow;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid #f6ddaa;
    box-sizing: border-box;
    border-radius: 100px;
    padding: 13px 0;
    text-align: center;
    margin-bottom: 18px;
    cursor: pointer;
    @media (min-width: $viewport--md) {
      width: 23%;
    }
    @media (min-width: $viewport--lg+1) {
      width: 15%;
    }
  }
}
.slick-dots li {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0 5px;
  padding: 0;
  cursor: pointer;
}
.slick-dots li button {
  font-size: 0;
  line-height: 0;
  display: block;
  width: 20px;
  height: 20px;
  padding: 5px;
  cursor: pointer;
  color: transparent;
  border: 0;
  outline: none;
  background: transparent;
}
.slick-dots li button:hover,
.slick-dots li button:focus {
  outline: none;
}
.slick-dots li button:hover:before,
.slick-dots li button:focus:before {
  opacity: 1;
}
.slick-dots li button:before {
  font-family: "slick";
  font-size: 6px;
  line-height: 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  content: "•";
  text-align: center;
  opacity: 0.25;
  color: black;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.slick-dots li.slick-active button:before {
  opacity: 0.75;
  color: black;
}

.slick {
  &-slider {
    background: $pl-gray;
  }
  &-dots {
    padding-inline-start: 0;
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, -50%);
    & > li {
      width: 10px;
      height: 10px;
      border: 1px solid #fff;
      border-radius: 10px;
      cursor: pointer;
      background-color: #fff;
      padding: 0;
      &.slick-active {
        background-color: $pl-gray;
        border-color: $pl-gray;
      }
    }
  }
}
</style>
