<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="toggleWindows(['cart'])"
        />
        <span class="sidebar-cart__top-line-title">ВАШ ЗАКАЗ</span>
        <div
          id="mobile-burger"
          @click="toggleWindows(['cart'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <template v-if="$store.state.cart.length > 0">
        <div class="sidebar-cart__types">
          <div
            v-if="
              $store.state.cart.some(
                (y) =>
                  y.deliveryZoneTypes.indexOf('cooked') != -1 && y.coast !== 0
              )
            "
            class="sidebar-cart__type"
          >
            <div class="sidebar-cart__type-title">ГОТОВЫЕ БЛЮДА</div>
            <div class="sidebar-cart__type-positions">
              <div
                v-for="(position, i) in $store.state.cart.filter(
                  (y) =>
                    y.deliveryZoneTypes.indexOf('cooked') != -1 && y.coast !== 0
                )"
                :key="i"
              >
                <div
                  class="sidebar-cart__type-position"
                  :key="j"
                  v-for="(serving, j) in position.servings"
                >
                  <div class="position__name-wrapper">
                    <span class="position__title"
                      >{{ position.group_name }} - {{ position.name }}</span
                    >
                    <span class="position__serving">
                      Порция
                      {{ serving.quantity }}
                      {{ serving.measure }}</span
                    >
                  </div>
                  <div class="position__counter-wrapper">
                    <div class="position__counter">
                      <span
                        @click="coastChange(serving, -1)"
                        class="position__counter-button"
                        >–</span
                      >
                      <span>{{ serving.counter }}</span>
                      <span
                        @click="coastChange(serving, 1)"
                        class="position__counter-button"
                        >+</span
                      >
                    </div>
                    <span class="position__price"
                      >{{ serving.counter * serving.price }} ₽</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              $store.state.cart.some(
                (y) =>
                  y.deliveryZoneTypes.indexOf('frozen') != -1 &&
                  y.servings.length !== 0
              )
            "
            class="sidebar-cart__type"
          >
            <div class="sidebar-cart__type-title">ЗАМОРОЖЕННЫЕ БЛЮДА</div>
            <div class="sidebar-cart__type-positions">
              <div
                v-for="(position, i) in $store.state.cart.filter(
                  (y) =>
                    y.deliveryZoneTypes.indexOf('frozen') != -1 &&
                    y.servings.length !== 0
                )"
                :key="i"
              >
                <div
                  class="sidebar-cart__type-position"
                  v-for="(serving, j) in position.servings"
                  :key="j"
                >
                  <div class="position__name-wrapper">
                    <span class="position__title"
                      >{{ position.group_name }} - {{ position.name }}</span
                    >
                    <span class="position__serving">
                      Порция
                      {{ serving.quantity }}
                      {{ serving.measure }}</span
                    >
                  </div>
                  <div class="position__counter-wrapper">
                    <div class="position__counter">
                      <span
                        @click="coastChange(serving, -1)"
                        class="position__counter-button"
                        >–</span
                      >
                      <span>{{ serving.counter }}</span>
                      <span
                        @click="coastChange(serving, 1)"
                        class="position__counter-button"
                        >+</span
                      >
                    </div>
                    <span class="position__price"
                      >{{ serving.counter * serving.price }} ₽</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="sidebar-cart__type sidebar-cart__type-line">
            <div class="sidebar-cart__type-title">ПРИБОРЫ</div>
            <div class="position__counter">
              <span @click="cutleryChange(-1)" class="position__counter-button"
                >–</span
              >
              <span>{{ $store.state.orderInfo.guestsCount }}</span>
              <span @click="cutleryChange(1)" class="position__counter-button"
                >+</span
              >
            </div>
          </div>

          <div
            v-if="$store.state.orderInfo.receiveType === 'delivery'"
            class="sidebar-cart__type sidebar-cart__type-line"
          >
            <div class="sidebar-cart__type-title">ДОСТАВКА</div>
            <div class="sidebar-cart__type-title">{{ deliveryCost }} ₽</div>
          </div>
          <div
            class="
              sidebar-cart__type
              sidebar-cart__type-line
              sidebar-cart__type-line--last
            "
          >
            <div class="sidebar-cart__type-title">ИТОГО</div>
            <div class="sidebar-cart__type-title">
              {{ $store.state.cartPrice + deliveryCost }} ₽
            </div>
          </div>
          <div class="full-line full-line--mobile">
            <button
              @click="toggleWindows(['ordering'])"
              class="button button-default"
            >
              ОФОРМЛЕНИЕ ЗАКАЗА
            </button>
          </div>
        </div>
        <div class="sidebar-cart__bottom-line">
          <button
            @click="toggleWindows(['ordering'])"
            class="button button-default"
          >
            ОФОРМЛЕНИЕ ЗАКАЗА
          </button>
        </div>
      </template>
      <div class="sidebar-cart__empty" v-else>
        <span class="sidebar-cart__empty-title">Ваша корзина пуста</span>
        <span class="sidebar-cart__empty-description"
          >Добавьте что-нибудь из меню</span
        >
        <button @click="toMenu()" class="button button-default">В МЕНЮ</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    deliveryCost() {
      return this.$store.state.orderInfo.receiveType === "delivery" &&
        this.$store.state.cartPrice <
          this.$store.state.deliveryZone.deliveryFreeFrom
        ? this.$store.state.deliveryZone.deliveryCost
        : 0;
    },
  },
  methods: {
    toggleWindows(data) {
      this.$emit("toggleLayers", data);
    },
    toMenu() {
      this.toggleWindows(["cart"]);
      if (this.$route.name !== "Menu") this.$router.push({ name: "Menu" });
    },
    coastChange(item, i) {
      this.$store.commit("coastChange", { item, i });
    },
    cutleryChange(i) {
      this.$store.commit("changeGuestsCount", i);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.position {
  line-height: 25px;
  &__number {
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: -0.08px;
    color: $pl-gray;
    width: 6%;
  }
  &__name-wrapper {
    display: flex;
    flex-direction: column;
    width: 65%;
    & .position__title {
      font-weight: normal;
      font-size: 15px;
      line-height: 18px;
      letter-spacing: -0.08px;
      color: $pl-gray;
    }
    & .position__serving {
      font-weight: normal;
      font-size: 12px;
      line-height: 18px;
      letter-spacing: -0.08px;
      color: $pl-light_gray;
    }
  }
  &__price {
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    letter-spacing: -0.08px;
    color: $pl-gray;
  }
  &__counter {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    border-color: $pl-white;
    background-color: $pl-white;
    height: 24px;
    width: 77px;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
    border-radius: 21px;
    color: $pl-gray;
    user-select: none;
    letter-spacing: -0.08px;
    margin-bottom: 10px;
    &-wrapper {
      width: 23%;
      min-width: 77px;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      align-items: flex-end;
    }
    &-button {
      cursor: pointer;
    }
  }
}
.sidebar-cart__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
  & > * {
    margin-bottom: 15px;
  }
  &-title {
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
  }
  &-description {
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
  }
}
</style>
