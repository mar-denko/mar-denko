<template>
  <div class="postPage">
    <div class="page-wrapper">
      <div class="postPage__line-top">
        <img
          class="postPage__line-top--back"
          src="@/assets/icons/arrow-left.svg"
          @click="$router.go(-1)"
        />
        <h2>КАК ПРИГОТОВИТЬ?</h2>
        <div></div>
      </div>
      <div class="postPage__line-middle">
        <div v-if="groups !== null" class="menu">
          <div class="menu__wrapper">
            <router-link
              v-for="(item, i) in groups"
              :key="i"
              :to="{
                name: 'howTo',
                params: {
                  groupId: item.id,
                },
              }"
              tag="div"
              :class="{
                'menu__item--active': group.id === item.id,
              }"
              class="menu__item"
              >{{ item.name }}</router-link
            >
          </div>
        </div>
        <p v-if="group !== null">{{ group.recipe }}</p>
      </div>
      <div v-if="group !== null" class="postPage__line-bottom">
        <div v-if="group.recipeUrl" class="post__video">
          <LazyYoutube :src="group.recipeUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const groups = DataFactory.get("groups");

export default {
  name: "Home",
  data() {
    return {
      groups: null,
      group: null,
    };
  },
  async created() {
    await this.getGroups();
  },
  watch: {
    $route(to) {
      this.group = this.groups.find((x) => x.id === to.params.groupId);
    },
  },
  methods: {
    async getGroups() {
      try {
        this.isLoading = true;
        const { data } = await groups.getGroups(this.$route.params.groupId);
        this.groups = data.filter((x) => x.recipe !== "" || x.recipeUrl !== "");
        let group = this.groups.find(
          (x) => x.id === this.$route.params.groupId
        );
        if (group) this.group = group;
        else this.group = this.groups[0];

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
.menu {
  background-color: inherit;
  &__item {
    border: 1px solid $pl-gray;
    color: $pl-gray;
    &--active {
      background-color: $pl-gray;
      color: $pl-yellow;
    }
  }
}
</style>
