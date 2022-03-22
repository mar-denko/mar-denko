<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['signIn'])"
        />
        <span class="sidebar-cart__top-line-title">АВТОРИЗАЦИЯ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['signIn'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="signInForm"
        @submit.prevent="signIn()"
        class="sidebar-cart__middle"
      >
        <div class="full-line">
          <label class="input-label" for="phoneNumber"
            >Ваш номер телефона</label
          >
          <TheMask
            v-model="user.username"
            :mask="['+7 (###) ###-##-##']"
            :masked="false"
            placeholder="+7"
            id="phoneNumber"
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
          <label class="input-label" for="password">Ваш пароль</label>
          <input
            v-model="user.password"
            class="input"
            type="password"
            autocomplete="new-password"
            id="password"
            required
            :class="{ 'error-input': userError.password }"
          />
          <span class="error-span" v-if="userError.password"
            >Неверный номер или пароль</span
          >
        </div>
        <div class="full-line">
          <FormSubmitButton
            class="button-red"
            form="signInForm"
            :isLoading="isLoading"
            :text="'ВОЙТИ'"
          />
          <div class="auth__links">
            <span
              @click.prevent="$emit('toggleLayers', ['recovery'])"
              class="auth__links--left"
              >Забыл пароль</span
            >
            <span
              @click.prevent="$emit('toggleLayers', ['signUp'])"
              class="auth__links--right"
              >Зарегистрироваться</span
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";
import auth from "@/services/Auth/AuthWorker.js";
import { DataFactory } from "@/services/Api/DataFactory.js";
const users = DataFactory.get("users");
import FormSubmitButton from "@/components/FormSubmitButton.vue";

export default {
  components: {
    TheMask,
    FormSubmitButton,
  },
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      userError: {
        usernameLength: false,
        userNotFound: false,
        password: false,
      },
      isLoading: false,
    };
  },
  methods: {
    async signIn() {
      if (this.isLoading) return;
      this.userError.usernameLength = false;
      let user = JSON.parse(JSON.stringify(this.user));
      if (user.username.length !== 10) {
        this.userError.usernameLength = true;
        return;
      }
      user.username = `+7${user.username}`;
      let answer = await auth.signIn(user);
      if (answer === "passwordError") {
        this.userError.password = true;
        return;
      }
      if (answer === "userNotFound") {
        this.userError.userNotFound = true;
        return;
      }
      this.isLoading = true;
      const userOwnResponse = await users.getUserOwn();
      if (userOwnResponse === "continueSignUp") {
        this.$emit("toggleLayers", ["signIn", "signUpContinue"]);
        return;
      } else {
        this.$store.commit("changeStateVariable", {
          variable: "userData",
          data: userOwnResponse.data,
        });
        this.$emit("toggleLayers", ["signIn", "account"]);
      }
      this.isLoading = false;
    },
  },
};
</script>
