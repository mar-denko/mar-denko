<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['signUpConfirm'])"
        />
        <span class="sidebar-cart__top-line-title">Введите код из смс</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['signUpConfirm'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="signUpConfirmForm"
        @submit.prevent="signUpConfirm()"
        class="sidebar-cart__middle"
      >
        <div class="sidebar-cart__middle">
          <div class="full-line">
            <label class="input-label" for="name">Код</label>
            <input
              v-model="code"
              class="input"
              type="text"
              id="name"
              required
            />
          </div>
          <div class="full-line full-line--mobile">
            <FormSubmitButton
              form="signUpConfirmForm"
              :isLoading="isLoading"
              :text="'ПОДТВЕРДИТЬ'"
              class="button-red"
            />
          </div>
        </div>
      </form>
      <div class="sidebar-cart__bottom-line">
        <FormSubmitButton
          form="signUpConfirmForm"
          :isLoading="isLoading"
          :text="'ПОДТВЕРДИТЬ'"
          class="button-red"
        />
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/services/Auth/AuthWorker.js";
import { DataFactory } from "@/services/Api/DataFactory.js";
const users = DataFactory.get("users");

import FormSubmitButton from "@/components/FormSubmitButton.vue";
export default {
  components: {
    FormSubmitButton,
  },
  data() {
    return {
      code: "",
      isLoading: false,
    };
  },
  methods: {
    async signUpConfirm() {
      try {
        if (this.isLoading) return;
        this.isLoading = true;
        const newUserDataFromVuex = this.$store.state.newUserData;
        await auth.confirmUser({
          code: this.code,
          username: newUserDataFromVuex.phone,
        });

        const newUserDataToApi = {
          fullName: newUserDataFromVuex.firstName,
          firstName: newUserDataFromVuex.firstName,
          email: newUserDataFromVuex.email,
        };
        let userOwnResponse = await users.createUser(newUserDataToApi);
        this.$store.commit("changeStateVariable", {
          variable: "userData",
          data: userOwnResponse.data,
        });
        this.$emit("toggleLayers", ["all", "account"]);
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
