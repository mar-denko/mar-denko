<template>
  <div :style="pageStyle" id="app">
    <Header @toggleLayers="toggleLayers" />
    <router-view v-if="!isLoading" class="page" />
    <footer>
      <Footer />
    </footer>
    <div :class="{ 'dark-layer': $store.state.darkLayerExist }">
      <transition name="fade">
        <Account v-if="$route.query.account" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <Cart v-if="$route.query.cart" @toggleLayers="toggleLayers" />
        <SideMenu v-if="$route.query.sidemenu" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <Ordering
          v-if="$route.query.ordering"
          @toggleLayers="toggleLayers"
          @createOrder="createOrder"
        />
      </transition>
      <transition name="fade">
        <ChooseRest
          v-if="$route.query.chooseRestaurant"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <ChooseTable
          v-if="$route.query.chooseTable"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <Addresses v-if="$route.query.addresses" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <ChooseAddress
          v-if="$route.query.chooseAddress"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <DeliveryAddress
          @toggleLayers="toggleLayers"
          @changeCartItemsAfterChangingAddress="
            changeCartItemsAfterChangingAddress
          "
          v-if="$route.query.deliveryAddress"
        />
      </transition>
      <transition name="fade">
        <OnAddressChange
          v-if="$route.query.onAddressChange"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <Modal v-if="$route.query.modalSwitch" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <SignIn v-if="$route.query.signIn" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <SignUp v-if="$route.query.signUp" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <SignUpConfirm
          v-if="$route.query.signUpConfirm"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <SignUpContinue
          v-if="$route.query.signUpContinue"
          @toggleLayers="toggleLayers"
        />
      </transition>

      <transition name="fade">
        <BonusHistory
          v-if="$route.query.bonusHistory"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <EditAccount
          v-if="$route.query.editAccount"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <Recovery v-if="$route.query.recovery" @toggleLayers="toggleLayers" />
      </transition>
      <transition name="fade">
        <RecoveryConfirm
          v-if="$route.query.recoveryConfirm"
          @toggleLayers="toggleLayers"
        />
      </transition>
      <transition name="fade">
        <NewPassword
          v-if="$route.query.newPassword"
          @toggleLayers="toggleLayers"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Cart from "@/components/Cart.vue";
import SideMenu from "@/components/SideMenu.vue";
import Ordering from "@/components/Ordering.vue";
import ChooseRest from "@/components/ChooseRest.vue";
import ChooseTable from "@/components/ChooseTable.vue";
import DeliveryAddress from "@/components/DeliveryAddress.vue";
import Modal from "@/components/Modal.vue";
import SignUp from "@/components/auth/SignUp.vue";
import SignUpConfirm from "@/components/auth/SignUpConfirm.vue";
import SignUpContinue from "@/components/auth/SignUpContinue.vue";
import SignIn from "@/components/auth/SignIn.vue";
import Recovery from "@/components/auth/Recovery.vue";
import RecoveryConfirm from "@/components/auth/RecoveryConfirm.vue";
import NewPassword from "@/components/auth/NewPassword.vue";
import Account from "@/components/account/Account.vue";
import EditAccount from "@/components/account/EditAccount.vue";
import OnAddressChange from "@/components/OnAddressChange.vue";
import BonusHistory from "@/components/account/BonusHistory.vue";
import Addresses from "@/components/account/Addresses.vue";
import ChooseAddress from "@/components/ChooseAddress.vue";

import { DataFactory } from "@/services/Api/DataFactory.js";
const dicts = DataFactory.get("dicts");
const orders = DataFactory.get("orders");
const users = DataFactory.get("users");

export default {
  name: "Home",
  components: {
    Header,
    Footer,
    Cart,
    SideMenu,
    Ordering,
    ChooseRest,
    ChooseTable,
    DeliveryAddress,
    Modal,
    SignUp,
    SignUpConfirm,
    SignUpContinue,
    SignIn,
    NewPassword,
    RecoveryConfirm,
    Recovery,
    Account,
    EditAccount,
    OnAddressChange,
    BonusHistory,
    Addresses,
    ChooseAddress,
  },
  data() {
    return {
      modalSwitch: false,
      headerHeight: "50px",
      isLoading: false,
    };
  },
  updated() {
    this.$nextTick(() => {
      if (this.$route.query.payment) {
        if (this.$route.query.payment === "success") this.afterPaymentSuccess();
        if (this.$route.query.payment === "failed") this.afterPaymentFailed();
      }
      if (this.$route.query.order)
        if (this.$route.query.order === "failed") this.afterOrderFailed();
    });
    const darkLayerExist =
      Object.keys(this.$route.query).length > 0 ? true : false;
    this.$store.commit("changeStateVariable", {
      variable: "darkLayerExist",
      data: darkLayerExist,
    });
    this.stopScrollHandler();
  },
  methods: {
    toggleLayers(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === "all")
          this.$router.replace({
            query: {},
          });
        else {
          //все окна работают через query параметры. Если параметр уже в url, удаляем его. Если нет - добавляем
          if (data[i] in this.$route.query) {
            const query = Object.assign({}, this.$route.query);
            delete query[data[i]];
            this.$router.replace({ query });
          } else {
            const query = {
              ...this.$route.query,
              [data[i]]: true,
            };
            this.$router.replace({
              query,
            });
          }
        }
      }
      this.handleNewHeaderLine();
      this.stopScrollHandler();
      this.$forceUpdate();
    },
    changeCartItemsAfterChangingAddress() {
      if (this.$store.state.cart.length > 0) {
        if (
          this.$store.state.orderInfo.receiveType === "delivery" &&
          this.$store.state.deliveryZone.deliveryZoneTypes.length === 1 &&
          this.$store.state.deliveryZone.deliveryZoneTypes[0] === "frozen"
        ) {
          let cart = JSON.parse(JSON.stringify(this.$store.state.cart));
          cart = cart.filter(
            (cartItem) => cartItem.deliveryZoneTypes[0] === "frozen"
          );
          this.$store.commit("changeStateVariable", {
            variable: "cart",
            data: cart,
          });
          this.$store.commit("priceChanged");
        }
      }
    },
    async getReceiveTypes() {
      try {
        this.isLoading = true;
        const { data } = await dicts.getReceiveTypes();
        this.$store.commit("changeStateVariable", {
          variable: "receiveTypes",
          data: data.sort((a, b) => a.sortingNumber - b.sortingNumber),
        });
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    handleResize() {
      this.$store.commit("changeStateVariable", {
        variable: "windowWidth",
        data: window.innerWidth,
      });
      this.handleNewHeaderLine();
    },
    handleNewHeaderLine() {
      this.$nextTick(() => {
        this.headerHeight =
          document.getElementsByClassName("header-line").length * 50 +
          document.getElementsByClassName("header-toggler").length * 16 +
          "px";
        this.$forceUpdate();
      });
    },
    afterPaymentSuccess() {
      if (this.$route.query.ordering) this.toggleLayers(["ordering", "cart"]);
      this.$store.commit("changeStateVariable", {
        variable: "cart",
        data: [],
      });
      this.$store.commit("priceChanged");
      let idFromTillypad = JSON.parse(
        JSON.stringify(this.$store.state.orderFromApi.id)
      );
      console.log(idFromTillypad);
      this.$store.commit("priceChanged");
      if (this.$route.query.payment) this.toggleLayers(["payment"]);

      //формируем сообщения в зависимости от типа и времени доставки
      let description;
      if (this.$store.state.orderFromApi.receiveTime === null) {
        if (this.$store.state.orderFromApi.receiveType === "delivery")
          description = `Ваш заказ принят.\nДоставка (в среднем) - в течении часа.`;
        else description = `Ваш заказ принят.`;
      } else {
        let date = new Date(this.$store.state.orderFromApi.receiveTime);
        let timeOptions = { hour: "2-digit", minute: "2-digit" };
        let dateOptions = { month: "long", day: "numeric" };
        if (this.$store.state.orderFromApi.receiveType === "delivery")
          description = `Ваш заказ принят.\nЗаказ будет доставлен ${date.toLocaleDateString(
            "ru-RU",
            dateOptions
          )} к ${date.toLocaleTimeString("ru-RU", timeOptions)} `;
        else
          description = `Ваш заказ принят.\nЗаказ будет ждать вас ${date.toLocaleDateString(
            "ru-RU",
            dateOptions
          )} к ${date.toLocaleTimeString("ru-RU", timeOptions)} `;
      }
      let modalData = {
        variable: "modalData",
        data: {
          title: "Заказ оплачен!",
          description: description,
          buttonText: "ЗАКРЫТЬ",
          switches: ["modalSwitch"],
        },
      };
      this.$store.commit("changeStateVariable", modalData);
      this.$store.commit("changeStateVariable", {
        variable: "orderFromApi",
        data: null,
      });
      if (this.$store.state.userData) {
        this.$nextTick(async () => {
          const userOwnResponse = await users.getUserOwn();
          this.$store.commit("changeStateVariable", {
            variable: "userData",
            data: userOwnResponse.data,
          });
        });
      }
    },
    afterPaymentFailed() {
      if (this.$route.query.ordering) this.toggleLayers(["ordering", "cart"]);
      let idFromTillypad = JSON.parse(
        JSON.stringify(this.$store.state.orderFromApi.id)
      );
      console.log(idFromTillypad);
      let modalData = {
        variable: "modalData",
        data: {
          title: "Ошибка оплаты",
          description: `Не удалось оплатить заказ, попробуйте еще раз.`,
          buttonText: "ЗАКРЫТЬ",
          switches: ["modalSwitch"],
        },
      };
      this.$store.commit("changeStateVariable", modalData);
      this.toggleLayers(["payment"]);
    },
    afterOrderFailed() {
      if (this.$route.query.ordering) this.toggleLayers(["ordering"]);
      let idFromTillypad = JSON.parse(
        JSON.stringify(this.$store.state.orderFromApi.id)
      );
      console.log(idFromTillypad);
      let modalData = {
        variable: "modalData",
        data: {
          title: "Ошибка оформления заказа",
          description: `Ваш номер заказа: №${idFromTillypad}\n Позвоните, пожалуйста, нам,\n и мы всё уладим \n +7 (812) 600-79-29`,
          buttonText: "ЗАКРЫТЬ",
          switches: ["modalSwitch"],
        },
      };
      this.$store.commit("changeStateVariable", modalData);
      this.toggleLayers(["order"]);
    },
    oldOrderExist(payload) {
      if (this.$store.state.orderFromApi !== null) {
        let order = [];
        payload.content.forEach((option) => {
          let oldItem = this.$store.state.orderFromApi.content.find(
            (oldContent) =>
              oldContent.positionOptionServingId ===
                option.positionOptionServingId &&
              oldContent.number === option.number
          );
          oldItem !== undefined ? order.push(oldItem) : false;
        });
        //проверяем по всему заказу
        if (
          order.length === this.$store.state.orderFromApi.content.length &&
          payload.paymentType === this.$store.state.orderFromApi.paymentType &&
          payload.receiveType === this.$store.state.orderFromApi.receiveType &&
          payload.restaurantId ===
            this.$store.state.orderFromApi.restaurantId &&
          /* payload.confirmCall === this.$store.state.orderFromApi.confirmCall && */
          payload.tableId === this.$store.state.orderFromApi.tableId &&
          payload.receiveTime === this.$store.state.orderFromApi.receiveTime &&
          payload.guestName === this.$store.state.orderFromApi.guestName &&
          payload.guestPhone === this.$store.state.orderFromApi.guestPhone &&
          payload.guestsCount === this.$store.state.orderFromApi.guestsCount
        )
          return true;
      }
      return false;
    },
    async createOrder(payload) {
      try {
        this.isLoading = true;
        //если в прошлый раз оплата не прошёла, сравниваем заказы. Если такой же, то сразу отправляем на оплату
        if (this.oldOrderExist(payload)) {
          window.location = this.$store.state.orderFromApi.payUrl;
          return;
        } else {
          const { data } = await orders.createOrder(payload);
          this.$store.commit("changeStateVariable", {
            variable: "orderFromApi",
            data: data,
          });
          if (!data.payUrl) {
            this.afterPaymentSuccess();
          } else {
            window.location = data.payUrl;
          }
        }
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    stopScrollHandler() {
      let elementClassList = document.getElementById("body").classList;

      if (
        Object.keys(this.$route.query).length === 0 &&
        elementClassList.contains("stopScroll")
      )
        elementClassList.toggle("stopScroll");
      else {
        let modalsToBlock = [
          "cart",
          "sidemenu",
          "deliveryAddress",
          "chooseRestaurant",
          "signIn",
          "account",
          "chooseAddress",
        ];
        for (let key in this.$route.query) {
          if (
            modalsToBlock.indexOf(key) > -1 &&
            !elementClassList.contains("stopScroll")
          )
            elementClassList.toggle("stopScroll");
        }
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    new MutationObserver(() => {
      this.handleNewHeaderLine();
    }).observe(this.$el, { attributes: true });
  },
  computed: {
    pageStyle() {
      return {
        "--headerHeight": this.headerHeight,
      };
    },
    headerOpenedPlace() {
      this.handleNewHeaderLine();
      return this.$store.state.deliveryZone !== null ||
        this.$store.state.choosenRestaurant !== null
        ? false
        : true;
    },
    headerOpenedCart() {
      this.handleNewHeaderLine();
      return this.$store.getters.getCartList.length === 0 ? true : false;
    },
  },
  watch: {
    headerOpened() {
      return this.headerOpenedPlace;
    },
    headerOpenedPlace() {
      this.$store.commit("changeStateVariable", {
        variable: "headerOpened",
        data: this.headerOpenedPlace,
      });
    },
    headerOpenedCart() {
      this.$store.commit("changeStateVariable", {
        variable: "headerOpened",
        data: this.headerOpenedCart,
      });
    },
    //если модальное окно в vuex обновилось
    "$store.state.modalData"() {
      this.toggleLayers(["modalSwitch"]);
    },
    "$store.state.headerOpened"() {
      this.handleNewHeaderLine();
      return this.headerOpenedPlace;
    },
    "$store.state.orderInfo.receiveType"(newValue) {
      if (
        (newValue === "pick-up" &&
          this.$store.state.choosenRestaurant === null) ||
        (newValue === "restaurant" &&
          this.$store.state.orderInfo.tableId === null)
      ) {
        this.toggleLayers(["chooseRestaurant"]);
      } else if (
        newValue === "delivery" &&
        this.$store.state.deliveryZone === null
      ) {
        if (this.$store.state.userData) this.toggleLayers(["chooseAddress"]);
        else this.toggleLayers(["deliveryAddress"]);
      }
      this.handleNewHeaderLine();
    },
    $route() {
      this.stopScrollHandler();
    },
  },
  async created() {
    await this.getReceiveTypes();
    console.log(process.env.VUE_APP_COMMIT);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

body {
  margin: 0;
  width: 100%;
  background-color: $pl-gray;
}
h2 {
  @media (max-width: $viewport--lg) {
    font-size: 1.1em;
  }
  text-align: center;
}
.stopScroll {
  overflow: hidden;
}
#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $pl-gray;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.postPage {
  background: $pl-beige;
  &__line {
    &-top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-weight: 800;
      font-size: 18px;
      line-height: 25px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      &--back {
        cursor: pointer;
      }
    }
    &-middle p {
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
    }
  }
  .post {
    &__image {
      width: 100%;
    }
    &__text {
      word-break: break-word;
      white-space: pre-line;
    }
    &__subtitle {
      font-weight: 600;
      font-size: 14px;
      line-height: 18px;
      letter-spacing: -0.08px;
    }
  }
}
.page {
  padding-top: var(--headerHeight);
  min-height: calc(100vh - 225px - var(--headerHeight));
  &-wrapper {
    width: 90%;
    margin: 0 auto;
    padding: 20px 0;
    @media (min-width: $viewport--md) {
      width: 95%;
    }
    @media (min-width: $viewport--xl) {
      width: 1100px;
    }
  }
  &__button {
    border: 1px solid $pl-yellow;
    color: $pl-yellow;
    background-color: inherit;
    box-sizing: border-box;
    border-radius: 100px;
    width: 100%;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    padding: 9px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 20px;
    cursor: pointer;
    &--red {
      background-color: $pl-red;
      border-color: $pl-red;
      margin-bottom: 10px;
    }
  }
  &__howto {
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.1em;
    text-decoration-line: underline;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    cursor: pointer;
    &-icon {
      margin-right: 5px;
    }
  }
  &-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    @media (min-width: $viewport--md) {
      justify-content: flex-start;
      & > .page__name {
        margin-right: 50px;
      }
    }
  }
  &__name {
    font-weight: 800;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
}
.button {
  font-weight: 600;
  font-size: 13px;
  line-height: 19px;
  text-align: center;
  letter-spacing: 0.01em;
  box-shadow: 0px 4px 10px rgba(88, 88, 84, 0.24);
  border-radius: 60px;
  border: none;
  padding: 11px 22px;
  cursor: pointer;
  min-width: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  &-default {
    background: $pl-gray;
    color: $pl-yellow;
    &.button--half-opacity {
      background: $pl-gray-half-opacity;
    }
  }
  &-back {
    background: $pl-yellow;
    color: $pl-gray;
  }
  &-red {
    background: $pl-red;
    color: $pl-yellow;
    &.button--half-opacity {
      background: $pl-red-half-opacity;
    }
  }
}
.mobile-burger {
  display: block;
  cursor: pointer;
  & > * {
    width: 18px;
    height: 2px;
    background-color: $pl-gray;
    margin: 3px 0;
    transition: 0.4s;
    border-radius: 2px;
  }
}
.change {
  float: right;
  .bar1 {
    -webkit-transform: rotate(45deg) translate(0, 7px);
    transform: rotate(45deg) translate(0, 7px);
  }
  .bar2 {
    opacity: 0;
  }
  .bar3 {
    -webkit-transform: rotate(-45deg) translate(-0, -7px);
    transform: rotate(-45deg) translate(0, -7px);
  }
}
.sidebar-cart,
.sidebar-menu {
  & * {
    scrollbar-width: auto;
    scrollbar-color: #585854 #ffffff00;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: #ffffff00;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #585854;
      border-radius: 50px;
      border: 3px solid #ffffff00;
      max-height: 10px;
    }
  }
}
input {
  &[type="radio"],
  &[type="checkbox"] {
    &:checked,
    &:not(:checked) {
      position: absolute;
      left: -9999px;
      & + label {
        display: flex;
        align-items: center;
        align-content: center;
        flex-direction: row;
        justify-content: flex-start;
        position: relative;
        padding-left: 28px;
        line-height: 20px;
        cursor: pointer;
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        &:before {
          content: "";
          position: absolute;
          left: 0px;
          top: 0px;
          width: 18px;
          height: 18px;
          border: none;
          background-color: $pl-white;
          border-radius: 100%;
        }
        &:after {
          content: "";
          position: absolute;
          transition: all 0.2s ease;
          background: $pl-gray;
          left: 4px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 100%;
        }
      }
    }
    &:not(:checked) + label:after {
      opacity: 0;
    }
    &:checked + label:after {
      opacity: 1;
    }
  }
  &[type="time"],
  &[type="date"] {
    width: 100%;
    min-width: 100%;
  }
}
textarea.input {
  height: 100px;
  resize: none;
}
.input {
  background: $pl-white;
  border: none;
  box-sizing: border-box;
  border-radius: 20px;
  outline: none;
  width: 100%;
  padding: 11px;
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.01em;
  color: $pl-gray;
  &-label {
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    &--bold {
      font-weight: 600;
    }
  }
  margin-top: 5px;
}
.sidebar {
  &-cart {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    z-index: 100;
    padding: 16px 16px 30px;
    padding-top: calc(var(--headerHeight) + 20px);
    background-color: $pl-beige;
    &--full {
      padding-top: 16px;
      height: 100%;
      z-index: 102;
    }
    @media (min-width: $viewport--md) {
      width: 500px;
      padding-top: 16px;
      z-index: 102;
      padding: 22px 26px;
      height: 100%;
    }
    &__middle {
      height: 100%;
      overflow-y: auto;
      &--no-button {
        height: 100%;
      }
      & > * {
        margin-bottom: 20px;
      }
      &-halfsline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        & > * {
          width: 48%;
        }
      }
      &-subtitle {
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        letter-spacing: -0.08px;
      }
    }
    &-wrapper {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    & .bar1,
    .bar3 {
      background-color: $pl-gray;
      opacity: 0;
      @media (min-width: $viewport--md) {
        opacity: 1;
      }
    }
    &__top-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      margin-bottom: 20px;
      @media (min-width: $viewport--md) {
        margin-bottom: 10%;
      }
      &-back {
        opacity: 1;
        @media (min-width: $viewport--md) {
          opacity: 0;
        }
      }
      &-title {
        font-weight: 800;
        font-size: 18px;
        line-height: 25px;
        letter-spacing: 1px;
        color: $pl-gray;
      }
    }
    .full-line--mobile {
      display: none;
      @media (max-width: $viewport--md) {
        display: block;
      }
    }
    &__bottom-line {
      width: 100%;
      display: none;
      @media (min-width: $viewport--md) {
        display: block;
      }
    }
    &__type {
      &-line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px 0 20px;
        border-bottom: 0.5px solid #c8c5bf;
        padding-bottom: 25px;
        &--last {
          border-bottom: none;
          padding-bottom: 0;
        }
        &--first {
          border-bottom: none;
          border-top: 0.5px solid #c8c5bf;
          padding: 10px 0 0;
        }
        & .sidebar-cart__type-title {
          margin: 0;
        }
      }
      &-title {
        font-weight: 800;
        font-size: 18px;
        line-height: 25px;
        letter-spacing: 1px;
        color: $pl-gray;
        margin: 0 0 17px 0;
        &--semibold {
          font-weight: 600;
        }
        @media (min-width: $viewport--md) {
          margin: 0 0 25px 0;
        }
      }
      &-positions {
        display: flex;
        flex-direction: column;
      }
      &-position {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        padding-bottom: 10px;
        border-bottom: 0.5px solid #c8c5bf;
        margin-bottom: 25px;
      }
    }
    &__types {
      overflow-y: auto;
      height: calc(100% - 45px);
    }
  }
}
.dark-layer {
  @media (min-width: $viewport--md) {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 101;
  }
}
.loader-wrapper {
  display: flex;
  min-height: inherit;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.theme-gray .vdatetime-popup__header,
.theme-gray .vdatetime-calendar__month__day--selected > span > span,
.theme-gray .vdatetime-calendar__month__day--selected:hover > span > span {
  background: $pl-gray;
}
.vdatetime-popup {
  position: absolute;
}
.theme-gray .vdatetime-year-picker__item--selected,
.theme-gray .vdatetime-time-picker__item--selected,
.theme-gray .vdatetime-popup__actions__button {
  color: $pl-gray;
}
.error {
  &-input {
    border: 1px solid $pl-red;
  }
  &-span {
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    color: $pl-red;
    margin-top: 10px;
    display: block;
  }
}
.auth__links {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-top: 15px;
  &--right {
    float: right;
  }
  & > * {
    cursor: pointer;
  }
}
</style>
