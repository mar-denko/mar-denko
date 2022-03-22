<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['editAccount'])"
        />
        <span class="sidebar-cart__top-line-title">ЛИЧНЫЕ ДАННЫЕ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['editAccount'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="editAccountForm"
        @submit.prevent="updateUser()"
        class="sidebar-cart__middle"
      >
        <div class="full-line">
          <label class="input-label" for="name">Ваше имя</label>
          <input
            v-model="user.fullName"
            class="input"
            type="text"
            id="name"
            required
          />
        </div>
        <div class="full-line">
          <label class="input-label" for="email">Ваш Email</label>
          <input v-model="user.email" class="input" type="email" id="email" />
        </div>
        <div class="full-line full-line--mobile">
          <FormSubmitButton
            class="button-default"
            form="editAccountForm"
            :isLoading="isLoading"
            :text="'СОХРАНИТЬ ИЗМЕНЕНИЯ'"
          />
        </div>
      </form>
      <div class="sidebar-cart__bottom-line">
        <FormSubmitButton
          class="button-default"
          form="editAccountForm"
          :isLoading="isLoading"
          :text="'СОХРАНИТЬ ИЗМЕНЕНИЯ'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const users = DataFactory.get("users");
import FormSubmitButton from "@/components/FormSubmitButton.vue";
export default {
  components: {
    FormSubmitButton,
  },
  data() {
    return {
      user: this.$store.state.userData,
      isLoading: false,
    };
  },
  methods: {
    async updateUser() {
      if (this.isLoading) return;
      this.isLoading = true;
      let user = JSON.parse(JSON.stringify(this.user));
      await users.updateUserOwn(user);
      this.$emit("toggleLayers", ["editAccount"]);
      this.isLoading = false;
    },
  },
};
</script>
