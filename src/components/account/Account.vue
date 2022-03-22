<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['account'])"
        />
        <span class="sidebar-cart__top-line-title">ПРОФИЛЬ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['account'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <div class="sidebar-cart__middle">
        <div class="full-line">
          <div class="account__menu">
            <div
              @click="$emit('toggleLayers', ['editAccount'])"
              class="account__menu--line"
            >
              Личные данные
              <img src="@/assets/icons/arrow-right.svg" alt="arrow" />
            </div>
            <div
              @click="$emit('toggleLayers', ['addresses'])"
              class="account__menu--line"
            >
              Адреса доставки
              <img src="@/assets/icons/arrow-right.svg" alt="arrow" />
            </div>
            <div
              @click="$emit('toggleLayers', ['bonusHistory'])"
              class="account__menu--line"
            >
              История бонусов
              <img src="@/assets/icons/arrow-right.svg" alt="arrow" />
            </div>
            <div
              @click="$emit('toggleLayers', ['recovery'])"
              class="account__menu--line"
            >
              Сменить пароль
              <img src="@/assets/icons/arrow-right.svg" alt="arrow" />
            </div>
            <!-- <div class="account__menu--line">
              Друзья
              <img src="@/assets/icons/arrow-right.svg" alt="arrow" />
            </div> -->
            <div @click="logout" class="account__menu--line">
              Выйти из аккаунта
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/services/Auth/AuthWorker.js";

export default {
  methods: {
    async logout() {
      await auth.logout();
      this.$store.commit("changeStateVariable", {
        variable: "userData",
        data: null,
      });
      this.$store.commit("changeStateVariable", {
        variable: "userAddresses",
        data: null,
      });
      this.$emit("toggleLayers", ["all"]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.account__menu {
  background: $pl-white;
  box-shadow: 0px 1px 34px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 0 12px;
  &--line {
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    height: 49px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: center;
    &:not(:last-child) {
      border-bottom: 1px solid #c7c4bd;
    }
  }
}
</style>
