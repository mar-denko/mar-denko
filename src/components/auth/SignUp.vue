<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['signUp'])"
        />
        <span class="sidebar-cart__top-line-title">РЕГИСТРАЦИЯ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['signUp'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="signUpForm"
        @submit.prevent="signUp()"
        class="sidebar-cart__middle"
      >
        <div class="full-line">
          <label class="input-label" for="name">Ваше имя</label>
          <input
            v-model="newUser.firstName"
            class="input"
            type="text"
            id="name"
            required
          />
        </div>
        <div class="full-line">
          <label class="input-label" for="number">Ваш номер телефона</label>
          <TheMask
            v-model="newUser.phone"
            :mask="['+7 (###) ###-##-##']"
            :masked="false"
            placeholder="+7"
            id="number"
            class="input"
            required
            :class="{ 'error-input': errors.phoneLength }"
          />
          <span class="error-span" v-if="errors.phoneLength"
            >Номер введен не полностью</span
          >
        </div>
        <div class="full-line">
          <label class="input-label" for="email">Ваш Email</label>
          <input
            v-model="newUser.email"
            class="input"
            type="email"
            id="email"
          />
        </div>
        <div class="full-line">
          <label class="input-label" for="password">Ваш пароль</label>
          <input
            v-model="newUser.password"
            class="input"
            type="password"
            autocomplete="new-password"
            id="password"
            required
            :class="{ 'error-input': errors.password }"
          />
          <span class="error-span" v-if="errors.password"
            >Пароли не совпадают</span
          >
        </div>
        <div class="full-line">
          <label class="input-label" for="passwordAgain"
            >Ваш пароль ещё раз</label
          >
          <input
            v-model="newUser.passwordAgain"
            class="input"
            type="password"
            autocomplete="new-password"
            id="passwordAgain"
            required
            :class="{ 'error-input': errors.password }"
          />
          <span class="error-span" v-if="errors.password"
            >Пароли не совпадают</span
          >
        </div>
        <div class="full-line full-line--mobile">
          <FormSubmitButton
            form="signUpForm"
            :isLoading="isLoading"
            :text="'ЗАРЕГИСТРИРОВАТЬСЯ'"
            class="button-red"
          />
        </div>
      </form>

      <div class="sidebar-cart__bottom-line">
        <FormSubmitButton
          class="button-red"
          form="signUpForm"
          :isLoading="isLoading"
          :text="'ЗАРЕГИСТРИРОВАТЬСЯ'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";
import auth from "@/services/Auth/AuthWorker.js";
import FormSubmitButton from "@/components/FormSubmitButton.vue";

export default {
  components: {
    TheMask,
    FormSubmitButton,
  },
  data() {
    return {
      newUser: {
        firstName: "",
        phone: "",
        email: "",
        password: "",
        passwordAgain: "",
      },
      errors: {
        password: false,
        phoneLength: false,
      },
      isLoading: false,
    };
  },
  methods: {
    async signUp() {
      if (this.isLoading) return;
      Object.keys(this.errors).forEach((v) => (this.errors[v] = false));
      if (this.newUser.phone.length !== 10) {
        this.userError.phoneLength = true;
        return;
      }
      if (this.newUser.password !== this.newUser.passwordAgain) {
        this.errors.password = true;
        return;
      }
      this.isLoading = true;
      let user = JSON.parse(JSON.stringify(this.newUser));
      user.phone = `+7${user.phone}`;
      this.$store.commit("changeStateVariable", {
        variable: "newUserData",
        data: user,
      });
      let newUserDataToAuth = {
        username: user.phone,
        password: user.password,
      };
      let signUpAnswer = await auth.signUp(newUserDataToAuth);
      if (signUpAnswer === "userAlreadyExist") {
        let modalData = {
          variable: "modalData",
          data: {
            description: "Вы уже зарегистрированы в системе",
            buttonText: "ВОЙТИ",
            switches: ["all", "signIn"],
          },
        };
        this.$store.commit("changeStateVariable", modalData);
        return;
      }
      await auth.signIn(newUserDataToAuth);
      this.$emit("toggleLayers", ["signUpConfirm"]);
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
