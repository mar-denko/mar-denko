<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['newPassword'])"
        />
        <span class="sidebar-cart__top-line-title">УСТАНОВКА ПАРОЛЯ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['newPassword'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="newPasswordForm"
        @submit.prevent="submitNewPassword()"
        class="sidebar-cart__middle"
      >
        <div class="full-line">
          <label class="input-label" for="password">Введите новый пароль</label>
          <input
            v-model="user.password"
            class="input"
            type="password"
            autocomplete="new-password"
            id="password"
            required
          />
        </div>
        <div class="full-line">
          <label class="input-label" for="passwordAgain"
            >Ваш новый пароль еще раз</label
          >
          <input
            v-model="user.passwordAgain"
            class="input"
            type="password"
            autocomplete="new-password"
            id="passwordAgain"
            required
          />
        </div>
        <div class="full-line">
          <button
            type="submit"
            form="newPasswordForm"
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
      user: {
        password: "",
        passwordAgain: "",
      },
      buttonText: this.$store.state.userData !== null ? "ПОДТВЕРДИТЬ" : "ВОЙТИ",
    };
  },
  methods: {
    async submitNewPassword() {
      this.isLoading = true;
      let data = JSON.parse(localStorage.getItem("recovery_data"));
      let hash = data.recovery_url.split("/");
      let json = {
        username: data.username,
        password: this.user.password,
      };
      await auth.newPassword(hash[hash.length - 2], data.salt, json);
      if (this.$store.state.userData) {
        this.$emit("toggleLayers", ["all", "signIn"]);
      }
      this.$emit("toggleLayers", ["all", "signIn"]);
      this.isLoading = false;
    },
  },
};
</script>
