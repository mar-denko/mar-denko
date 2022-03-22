<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['recovery'])"
        />
        <span class="sidebar-cart__top-line-title">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['recovery'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="recoveryForm"
        @submit.prevent="submitRecovery()"
        class="sidebar-cart__middle"
      >
        <div class="full-line">
          <label class="input-label" for="numberRecovery"
            >Ваш номер телефона</label
          >
          <TheMask
            v-model="user.username"
            :mask="['+7 (###) ###-##-##']"
            :masked="false"
            placeholder="+7"
            id="numberRecovery"
            class="input"
            required
            :class="{
              'error-input': userError.usernameLength || userError.userNotFound,
            }"
          />
          <span class="error-span" v-if="userError.usernameLength"
            >Номер введен не полностью</span
          >
          <span class="error-span" v-if="userError.userNotFound"
            >Пользователь не найден</span
          >
        </div>
        <div class="full-line">
          <button type="submit" form="recoveryForm" class="button button-red">
            {{ buttonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";
import auth from "@/services/Auth/AuthWorker.js";

export default {
  components: {
    TheMask,
  },
  data() {
    return {
      user: {
        username:
          this.$store.state.userData !== null
            ? this.$store.state.userData.authPhone
            : "",
      },
      userError: {
        usernameLength: false,
        userNotFound: false,
      },
      isLoading: false,
      buttonText:
        this.$store.state.userData !== null
          ? "СМЕНИТЬ ПАРОЛЬ"
          : "СБРОСИТЬ ПАРОЛЬ",
    };
  },
  methods: {
    async submitRecovery() {
      if (this.isLoading) return;
      let user = JSON.parse(JSON.stringify(this.user));
      this.userError.usernameLength = false;
      this.userError.userNotFound = false;
      if (user.username.length !== 10) {
        this.userError.usernameLength = true;
        return;
      }
      user.username = `+7${user.username}`;
      this.isLoading = true;
      await auth.recovery(user.username);
      let answer = await auth.recovery(user.username);
      if (answer === "userNotFound") {
        this.userError.userNotFound = true;
        this.isLoading = false;
        return;
      }
      this.$store.commit("changeStateVariable", {
        variable: "recoveryUser",
        data: user.username,
      });
      this.$emit("toggleLayers", ["recoveryConfirm"]);
      this.isLoading = false;
    },
  },
};
</script>
