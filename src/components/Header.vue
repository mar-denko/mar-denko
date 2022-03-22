<template>
  <header @wheel.prevent @scroll.prevent @touchmove.prevent class="header">
    <div class="header-wrapper">
      <div class="header-line header-line__top">
        <div class="header__left">
          <router-link
            :to="{
              name: 'Home',
            }"
            tag="div"
            div
            class="header__logo"
            ><img alt="logo" src="@/assets/pelmenya_logo.svg"
          /></router-link>
          <template v-if="$store.state.windowWidth >= 1140">
            <receiveTypeSwitcher />
            <HeaderAddress @click.native="chooseToggle()" />
            <div
              v-if="
                $store.state.deliveryZone !== null &&
                $store.state.orderInfo.receiveType === 'delivery' &&
                $store.state.deliveryZone.deliveryZoneTypes.length === 1 &&
                $store.state.deliveryZone.deliveryZoneTypes[0] === 'frozen'
              "
              class="header__address"
            >
              <img
                class="header__address-image"
                src="@/assets/icons/snow.svg"
              />
              <span class="header__address-text"
                >По вашему адресу - доставка <br />
                только замороженных п/ф</span
              >
            </div>
          </template>
        </div>
        <div
          class="header__center"
          v-if="
            $store.state.windowWidth >= 768 && $store.state.windowWidth < 1140
          "
        >
          <receiveTypeSwitcher />
        </div>
        <div class="header__right">
          <img
            v-if="$store.state.userData === null"
            alt="login"
            class="logo__clickable"
            @click="$emit('toggleLayers', ['signIn'])"
            src="@/assets/icons/login.svg"
          />
          <div class="header__account" v-else>
            <div class="header__account-balance">
              {{ $store.state.userData.accountBalance }} ₽
            </div>
            <img
              alt="profile"
              class="logo__clickable"
              @click="$emit('toggleLayers', ['account'])"
              src="@/assets/icons/profile.svg"
            />
          </div>
          <div
            id="mobile-burger"
            @click="$emit('toggleLayers', ['sidemenu'])"
            class="mobile-burger"
          >
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
          </div>
        </div>
      </div>
      <div
        v-if="
          $store.state.windowWidth >= 768 && $store.state.windowWidth < 1140
        "
        class="header__hidden-lines header__hidden-lines--opened"
      >
        <div class="header-line header-line--center">
          <HeaderAddress @click.native="chooseToggle()" />

          <div
            v-if="
              $store.state.deliveryZone !== null &&
              $store.state.orderInfo.receiveType === 'delivery' &&
              $store.state.deliveryZone.deliveryZoneTypes.length === 1 &&
              $store.state.deliveryZone.deliveryZoneTypes[0] === 'frozen'
            "
            class="header__address header__address--second"
          >
            <img class="header__address-image" src="@/assets/icons/snow.svg" />
            <span class="header__address-text"
              >По вашему адресу - доставка <br />
              только замороженных п/ф</span
            >
          </div>
        </div>
      </div>
      <div
        v-if="$store.state.windowWidth < 768"
        class="header__hidden-lines"
        :class="{
          'header__hidden-lines--opened': this.$store.state.headerOpened,
        }"
      >
        <div
          :class="{
            'header-line': this.$store.state.headerOpened,
          }"
        >
          <receiveTypeSwitcher />
        </div>
        <div
          :class="{
            'header-line': this.$store.state.headerOpened,
          }"
          class="header-line--center"
        >
          <HeaderAddress @click.native="chooseToggle()" />
        </div>
        <div
          v-if="
            $store.state.deliveryZone !== null &&
            $store.state.orderInfo.receiveType === 'delivery' &&
            $store.state.deliveryZone.deliveryZoneTypes.length === 1 &&
            $store.state.deliveryZone.deliveryZoneTypes[0] === 'frozen'
          "
          :class="{
            'header-line': this.$store.state.headerOpened,
          }"
          class="header-line--center"
        >
          <img class="header__address-image" src="@/assets/icons/snow.svg" />
          <span class="header__address-text"
            >По вашему адресу - доставка <br />
            только замороженных п/ф</span
          >
        </div>
      </div>
      <div
        v-if="$store.state.cartCount > 0"
        class="header-line header-line__cart"
      >
        <div class="header__left"></div>
        <div class="header__right header__full-line">
          <template
            v-if="
              $store.state.orderInfo.receiveType === 'delivery' &&
              $store.state.deliveryZone !== null &&
              $store.state.cartPrice <
                $store.state.deliveryZone.deliveryFreeFrom
            "
          >
            <span class="header__text"
              >Доставка:
              <span class="header__text-bold">
                {{ $store.state.deliveryZone.deliveryCost }} ₽</span
              ></span
            >
            <span class="header__text"
              >Итого, включая доставку:
              <span class="header__text-bold">
                {{
                  $store.state.cartPrice +
                  $store.state.deliveryZone.deliveryCost
                }}
                ₽</span
              >
            </span>
          </template>
          <template v-else>
            <span class="header__text"
              >Доставка: <span class="header__text-bold"> 0 ₽</span></span
            >
            <span class="header__text"
              >Итого, включая доставку:
              <span class="header__text-bold">
                {{ $store.state.cartPrice }}
                ₽</span
              >
            </span>
          </template>
          <div @click="openCart" class="header__cart-wrapper">
            <div class="header__cart-counter">
              {{ $store.state.cartCount }}
            </div>
            <img alt="cart" src="@/assets/icons/cart.svg" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="$store.state.windowWidth < 768 && zoneExist"
      @click="toggleHeader()"
      v-touch:swipe.bottom="
        () => {
          swipeHeader(true);
        }
      "
      v-touch:swipe.top="
        () => {
          swipeHeader(false);
        }
      "
      v-touch-options="{ touchClass: 'active', swipeTolerance: 30 }"
      class="header-toggler"
    ></div>
  </header>
</template>

<script>
import receiveTypeSwitcher from "./ReceiveTypeSwitcher.vue";
import HeaderAddress from "./HeaderAddress.vue";

export default {
  components: {
    receiveTypeSwitcher,
    HeaderAddress,
  },
  data() {
    return {};
  },
  computed: {
    zoneExist() {
      return (
        this.$store.state.deliveryZone !== null ||
        this.$store.state.choosenRestaurant !== null
      );
    },
    positionOptionsDisableSwitcher() {
      let state = this.$store.state;
      let result =
        (state.orderInfo.receiveType === "delivery" &&
          state.deliveryZone === null) ||
        (state.orderInfo.receiveType === "pick-up" &&
          state.choosenRestaurant === null) ||
        (state.orderInfo.receiveType === "restaurant" &&
          state.orderInfo.tableId === null);
      return result;
    },
  },
  methods: {
    checkDeliveryZone() {
      if (this.positionOptionsDisableSwitcher) {
        let getSwitch =
          this.$store.state.orderInfo.receiveType === "delivery"
            ? {
                switch: "deliveryAddress",
                text: "Для перехода в корзину вам необходимо ввести адрес доставки",
              }
            : {
                switch: "chooseRestaurant",
                text: "Для перехода в корзину вам необходимо выбрать ресторан",
              };
        let modalData = {
          variable: "modalData",
          data: {
            description: getSwitch.text,
            buttonText: "ВВЕСТИ АДРЕС",
            switches: ["modalSwitch", getSwitch.switch],
          },
        };
        this.$store.commit("changeStateVariable", modalData);
        return false;
      }
      return true;
    },
    openCart() {
      if (this.checkDeliveryZone()) this.$emit("toggleLayers", ["cart"]);
    },
    swipeHeader(bool) {
      this.$store.commit("changeStateVariable", {
        variable: "headerOpened",
        data: bool,
      });
    },
    toggleHeader() {
      this.$store.commit("changeStateVariable", {
        variable: "headerOpened",
        data: !this.$store.state.headerOpened,
      });
    },
    chooseToggle() {
      this.$emit(
        "toggleLayers",
        this.$store.state.orderInfo.receiveType !== "delivery"
          ? ["chooseRestaurant"]
          : this.$store.state.userData === null
          ? ["deliveryAddress"]
          : ["chooseAddress"]
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.mobile-burger > * {
  background-color: $pl-yellow;
}
.header {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  position: fixed;
  width: 100%;
  z-index: 101;
  background-color: $pl-gray;
  &__address {
    cursor: pointer;
    display: flex;
    &--second {
      margin-left: 40px;
    }
    &-text {
      margin-left: 16px;
      font-size: 12px;
      line-height: 16px;
      color: $pl-yellow;
    }
  }
  &__hidden-lines {
    transform-origin: 100% 0;
    transition: transform 0.2s linear;
    transform: scaleY(0);
    max-height: 0;
    &--opened {
      transform: scaleY(1);
      transition: transform 0.2s linear;
      max-height: 100%;
    }
  }
  &-toggler {
    background: $pl-yellow;
    border-radius: 20px;
    width: 80px;
    height: 4px;
    margin: 6px auto;
    cursor: pointer;
  }
  &__cart {
    &-wrapper {
      position: relative;
      cursor: pointer;
    }
    &-counter {
      display: flex;
      align-items: center;
      justify-content: center;
      left: -2px;
      position: absolute;
      font-weight: 600;
      font-size: 10px;
      line-height: 14px;
      width: 15px;
      height: 15px;
      border-radius: 100%;
      background-color: $pl-orange;
    }
  }
  &__text {
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: $pl-orange;
    &-bold {
      font-weight: bold;
      font-size: 20px;
      line-height: 27px;
    }
    @media (max-width: $viewport--md) {
      font-size: 12px;
      line-height: 16px;
      display: flex;
      flex-direction: column;
    }
  }
  &-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    &__top > * {
      @media (max-width: $viewport--lg) {
        flex: 1 0 0;
      }
    }
    &--center {
      justify-content: center;
    }
    &__cart {
      @media (max-width: $viewport--md) {
        & .header__left {
          display: none;
        }
        & .header__right {
          width: 100%;
        }
      }
    }
  }
  &-wrapper {
    width: 90%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    z-index: 101;
    @media (min-width: $viewport--md) {
      width: 95%;
    }
    @media (min-width: $viewport--lg) {
      width: 1100px;
    }
  }
  &__right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    & > *:not(:last-child) {
      margin-right: 17px;
    }
  }
  &__logo {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  &__left {
    display: flex;
    align-items: center;
    & > *:not(:last-child) {
      margin-right: 35px;
    }
  }
  &__account {
    display: flex;
    &-balance {
      font-weight: 600;
      font-size: 10px;
      line-height: 14px;
      background: $pl-orange;
      border-radius: 30px;
      padding: 4px 7px;
      margin-right: 6px;
    }
  }
  &__full-line {
    justify-content: space-between;
  }
}
.logo__clickable {
  cursor: pointer;
}
</style>
