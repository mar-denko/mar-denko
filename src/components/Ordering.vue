<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="toggleWindows(['ordering'])"
        />
        <span class="sidebar-cart__top-line-title">ОФОРМЛЕНИЕ И ОПЛАТА</span>
        <div
          id="mobile-burger"
          @click="toggleWindows(['ordering'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        id="createOrderForm"
        @submit.prevent="createOrder()"
        class="sidebar-cart__middle sidebar-cart__middle--no-button"
      >
        <!-- <div class="receive-type-switcher">
          <div
            v-for="(type, i) in $store.state.receiveTypes"
            :key="type.id"
            @click="choosereceiveType(type.id)"
            :class="{
              'receive-type-switcher__left': i === 0,
              'receive-type-switcher__right':
                i === $store.state.receiveTypes.length - 1,
              'receive-type-switcher__middle':
                i > 0 && i < $store.state.receiveTypes.length - 1,
              'receive-type-switcher__active':
                type.id === $store.state.orderInfo.receiveType,
            }"
          >
            {{ type.name }}
          </div>
        </div> -->
        <!--         <div
          v-if="$store.state.orderInfo.receiveType === 'delivery'"
          class="input-button"
        >
          <div class="input-button__text">
            {{ $store.state.deliveryAddress.street }},
            {{ $store.state.deliveryAddress.house }},
            {{ $store.state.deliveryAddress.apartment }}
          </div>
          <img src="@/assets/icons/arrow-right.svg" alt="arrow" />
        </div> -->
        <!--         <PlaceCard
          v-if="
            $store.state.orderInfo.receiveType !== 'delivery' &&
            $store.state.choosenRestaurant !== null
          "
          :restaurant="$store.state.choosenRestaurant"
        /> -->
        <div class="sidebar-cart__middle-subtitle">Контактные данные</div>
        <div class="sidebar-cart__middle-halfsline">
          <div>
            <label class="input-label" for="name">Имя</label>
            <input
              v-model="userInfo.name"
              class="input"
              type="text"
              id="name"
              required
              @blur="changeName"
            />
          </div>
          <div>
            <label class="input-label" for="number">Номер телефона</label>
            <TheMask
              v-model="userInfo.phone"
              :mask="['+7 (###) ###-##-##']"
              :masked="false"
              placeholder="+7"
              id="number"
              class="input"
              @blur.native="changePhone"
              required
              :class="{ 'error-input': phoneLengthError }"
            />
            <span class="error-span" v-if="phoneLengthError"
              >Номер введен не полностью</span
            >
          </div>
        </div>
        <div class="full-line">
          <label class="input-label" for="comment">Комментарий</label>
          <textarea
            class="input"
            v-model="userInfo.comment"
            @blur="changeComment"
            id="comment"
          />
        </div>
        <div class="sidebar-cart__middle-subtitle">Время доставки</div>
        <div class="checkbox-line">
          <input
            type="radio"
            v-model="receiveTime"
            :value="false"
            id="1check"
          />
          <label for="1check">На ближайшее время</label>
        </div>
        <div class="checkbox-line">
          <input type="radio" v-model="receiveTime" :value="true" id="2check" />
          <label for="2check">На определенную дату</label>
        </div>
        <template v-if="receiveTime === true">
          <div class="sidebar-cart__middle-subtitle">Дата и время</div>
          <div class="full-line">
            <datetime
              type="datetime"
              v-model="datetime"
              class="theme-gray"
              input-class="input"
              :phrases="{ ok: 'Далее', cancel: 'Выйти' }"
              :minute-step="5"
              :disabled-times="disabledTime"
              :min-datetime="
                new Date(Date.now() + 2 * (60 * 60 * 1000)).toISOString()
              "
              placeholder="Укажите конец"
              auto
            ></datetime>
          </div>
        </template>
        <div class="sidebar-cart__middle-subtitle">
          {{ deliveryPlaceData.subtitle }}
        </div>
        <div class="delivery-place">
          <img src="@/assets/icons/location.svg" alt="loc" />
          <span>{{ deliveryPlaceData.text }}</span>
        </div>
        <div class="sidebar-cart__middle-subtitle">Способ оплаты</div>
        <div class="checkbox-line">
          <input
            v-model="paymentType"
            value="online"
            type="radio"
            id="online"
          />
          <label for="online">Картой на сайте</label>
        </div>
        <div
          v-if="
            $store.state.orderInfo.receiveType !== 'delivery' &&
            $store.state.orderInfo.receiveType !== 'pick-up' &&
            $store.state.userData !== null
          "
          class="checkbox-line"
        >
          <input v-model="paymentType" type="radio" :value="null" id="cash" />
          <label for="cash">На месте</label>
        </div>
        <div class="checkbox-line">
          <input
            v-model="paymentType"
            @click.prevent="checkPoints($event)"
            type="radio"
            value="personal-account"
            :key="pointsKey"
            :disabled="$store.state.userData === null"
            id="personal-account"
          />
          <label for="personal-account">Баллами (нужна авторизация)</label>
        </div>
        <div class="sidebar-cart__middle-subtitle">Подтверждение заказа</div>
        <div class="checkbox-line">
          <input
            type="radio"
            id="confirm"
            :value="true"
            v-model="confirmCall"
          />
          <label for="confirm">Подтвердить заказ по телефону</label>
        </div>
        <div class="checkbox-line">
          <input
            type="radio"
            id="notConfirm"
            :value="false"
            v-model="confirmCall"
          />
          <label for="notConfirm">Не подтверждать заказ по телефону</label>
        </div>
        <div class="full-line--mobile">
          <FormSubmitButton
            :disabled="!ofertaCheckbox"
            class="button-default"
            form="createOrderForm"
            :isLoading="isLoading"
            :text="'ОПЛАТА ЗАКАЗА'"
          />
          <div class="oferta">
            <input v-model="ofertaCheckbox" type="checkbox" id="oferta" />
            <label for="oferta"
              >Нажимая на кнопку оплатить Вы соглашаетесь с офертой</label
            >
          </div>
        </div>
      </form>
      <div class="sidebar-cart__bottom-line">
        <div
          class="
            sidebar-cart__type
            sidebar-cart__type-line
            sidebar-cart__type-line--first
          "
        >
          <div class="sidebar-cart__type-title sidebar-cart__type-title--semibold">
            Итого включая доставку:
          </div>
          <div class="sidebar-cart__type-title">
            {{ $store.state.cartPrice + deliveryCost }} ₽
          </div>
        </div>
        <FormSubmitButton
          :disabled="!ofertaCheckbox"
          class="button-default"
          form="createOrderForm"
          :isLoading="isLoading"
          :text="'ОПЛАТА ЗАКАЗА'"
        />
        <div class="oferta">
          <input v-model="ofertaCheckbox" type="checkbox" id="oferta" />
          <label for="oferta"
            >Нажимая на кнопку оплатить Вы соглашаетесь с офертой</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";
import { Datetime } from "@/assets/vue-datetime";
import FormSubmitButton from "@/components/FormSubmitButton.vue";

export default {
  components: {
    TheMask,
    datetime: Datetime,
    FormSubmitButton,
  },
  data() {
    return {
      disabledTime: ["0:0-11:59", "22:1-24:0"],
      pointsKey: 0,
      today: new Date().toISOString().split("T")[0],
      receiveTime: false,
      datetime: new Date(Date.now() + 2 * (60 * 60 * 1000)).toISOString(),
      userInfo: {
        name:
          this.$store.state.orderInfo.guestName ||
          (this.$store.state.userData !== null
            ? this.$store.state.userData.fullName
            : false) ||
          "",
        phone:
          this.$store.state.orderInfo.guestPhone ||
          (this.$store.state.userData !== null
            ? this.$store.state.userData.authPhone
            : false) ||
          "",
        comment: this.$store.state.orderInfo.comment,
      },
      phoneLengthError: false,
      paymentType: this.$store.state.orderInfo.paymentType || "online",
      confirmCall: false,
      ofertaCheckbox: true,
      isLoading: false,
    };
  },
  created() {
    if (this.$store.state.orderInfo.paymentType !== "")
      this.paymentType = this.$store.state.orderInfo.paymentType;
  },
  methods: {
    toggleWindows(data) {
      this.$emit("toggleLayers", data);
    },
    checkPoints(event) {
      if (
        this.$store.state.userData.accountBalance <
        this.$store.state.cartPrice + this.deliveryCost
      ) {
        let modalData = {
          variable: "modalData",
          data: {
            description: "У вас недостаточно баллов для данного типа оплаты",
            buttonText: "ЗАКРЫТЬ",
            switches: ["modalSwitch"],
          },
        };
        this.$store.commit("changeStateVariable", modalData);
        this.paymentType = "online";
        return;
      } else {
        this.paymentType = event.target.id;
      }
      this.pointsKey += 1;
    },
    changeName() {
      this.$store.commit("changeGuestData", {
        variable: "guestName",
        data: this.userInfo.name,
      });
    },
    changePhone() {
      this.$store.commit("changeGuestData", {
        variable: "guestPhone",
        data: this.userInfo.phone,
      });
    },
    changeComment() {
      this.$store.commit("changeGuestData", {
        variable: "comment",
        data: this.userInfo.comment,
      });
    },
    coastChange(item, i) {
      this.$store.commit("coastChange", { item, i });
    },
    cutleryChange(i) {
      this.$store.commit("changeGuestsCount", i);
    },
    async createOrder() {
      if (this.isLoading) return;
      this.isLoading = true;
      let data = this.$store.state.orderInfo;
      //устанавливаем время
      if (this.receiveTime) data.receiveTime = this.datetime;
      else data.receiveTime = null;
      //ставим имя, телефон и комментарий
      data.guestName = this.userInfo.name;
      data.guestPhone = `+7${this.userInfo.phone}`;
      this.phoneLengthError = false;
      if (data.guestPhone.length !== 12) {
        this.phoneLengthError = true;
        return;
      }
      data.comment = this.userInfo.comment;
      data.guestsCount = parseInt(data.guestsCount);
      data.paymentApprovedUrl = `${location.href}&payment=success`;
      data.paymentFailedUrl = `${location.href}&payment=failed`;
      data.orderFailedUrl = `${location.href}&order=failed`;
      if (data.receiveType === "delivery") {
        data.address = this.$store.state.deliveryAddress;
        data.parsedAddress = this.$store.state.deliveryZone.parsedAddress;
      }
      //собираем заказ
      data.content = [];
      this.$store.state.cart.forEach((option) => {
        option.servings.forEach((serving) =>
          data.content.push({
            positionOptionServingId: serving.id,
            number: serving.counter,
          })
        );
      });
      this.$emit("createOrder", data);
    },
    async choosereceiveType(id) {
      await this.$store.commit("changeReceiveType", id);
    },
  },
  computed: {
    deliveryCost() {
      return this.$store.state.orderInfo.receiveType === "delivery" &&
        this.$store.state.cartPrice <
          this.$store.state.deliveryZone.deliveryFreeFrom
        ? this.$store.state.deliveryZone.deliveryCost
        : 0;
    },
    deliveryPlaceData() {
      let subtitleText = "";
      let text = "";
      if (this.$store.state.orderInfo.receiveType === "delivery") {
        subtitleText = "Куда доставим";
        text = `${this.$store.state.deliveryAddress.street}, ${this.$store.state.deliveryAddress.house}, ${this.$store.state.deliveryAddress.apartment}`;
      } else if (this.$store.state.orderInfo.receiveType === "pick-up") {
        subtitleText = "Откуда забирать";
        text = this.$store.state.choosenRestaurant.address;
      } else if (this.$store.state.orderInfo.receiveType === "restaurant") {
        subtitleText = "Куда принесем";
        text = `${this.$store.state.choosenRestaurant.address}\n
            Стол ${this.$store.state.orderInfo.tableNumber}, ${this.$store.state.orderInfo.guestsCount} гостей`;
      }
      return { subtitle: subtitleText, text: text };
    },
  },
  watch: {
    confirmCall() {
      this.$store.commit("changeConfirmationCall", this.confirmCall);
    },
    paymentType() {
      this.$store.commit("changePaymentType", this.paymentType);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
/* .receive-type-switcher {
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: $pl-gray;

  & * {
    flex: 1 0 0;
    border: 1px solid #585854;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-transform: uppercase;
  }
  &__active {
    background: $pl-gray;
    color: $pl-yellow;
  }
  &__left {
    border-radius: 100px 0 0 100px;
  }
  &__middle {
    border-left: none;
    border-right: none;
  }
  &__right {
    border-radius: 0 100px 100px 0;
  }
} */
.input-button {
  width: calc(100% - 24px);
  height: 38px;
  border-radius: 20px;
  background: #fff;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: $pl-gray;
  cursor: pointer;
}

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
.delivery-place {
  display: flex;
  align-items: center;
  img {
    margin-right: 13px;
  }
  span {
    font-weight: normal;
    font-size: 14px;
    line-height: 10px;
    white-space: pre-line;
  }
}
.oferta {
  text-align: center;
  margin-top: 10px;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;
}
</style>
