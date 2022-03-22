<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['recoveryConfirm'])"
        />
        <span class="sidebar-cart__top-line-title">ВВЕДИТЕ КОД ИЗ СМС</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['recoveryConfirm'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="recoveryConfirmForm"
        @submit.prevent="recoveryConfirm()"
        class="sidebar-cart__middle"
      >
        <div class="full-line">
          <label class="input-label" for="name">Код</label>
          <input v-model="code" class="input" type="text" id="name" required />
        </div>
        <div class="full-line">
          <button
            type="submit"
            form="recoveryConfirmForm"
            class="button button-red"
          >
            {{ buttonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import auth from "@/services/Auth/AuthWorker.js";

export default {
  data() {
    return {
      code: "",
      buttonText:
        this.$store.state.userData !== null
          ? "СМЕНИТЬ ПАРОЛЬ"
          : "СБРОСИТЬ ПАРОЛЬ",
      isLoading: false,
    };
  },
  methods: {
    async recoveryConfirm() {
      try {
        this.isLoading = true;
        let json = {
          username: this.$store.state.recoveryUser,
          code: this.code,
        };
        let req = await auth.recoveryConfirm(json);
        if (req) this.$emit("toggleLayers", ["newPassword"]);
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
</style>
