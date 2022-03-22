<template>
  <div class="sidebar-cart sidebar-cart--full">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="closeDeliveryAddress"
        />
        <span class="sidebar-cart__top-line-title">ВЫБОР АДРЕСА ДОСТАВКИ</span>
        <div
          id="mobile-burger"
          @click="closeDeliveryAddress"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <form
        class="sidebar-cart__middle"
        id="addressForm"
        @submit.prevent="checkDeliveryZoneExist()"
      >
        <div class="sidebar-cart__middle-line">
          <div>
            <label class="input-label input-label--bold" for="street"
              >Улица</label
            >
            <input
              list="streets"
              class="input"
              :value="address.street"
              @input="(e) => (address.street = e.target.value)"
              :class="{
                'error-input': addressFromApiError || addressNotExistError,
              }"
              type="search"
              id="street"
              required
            />
            <span class="error-span" v-if="addressFromApiError"
              >Выберите улицу из предложенных</span
            >
            <span class="error-span" v-if="addressNotExistError"
              >Улица не найдена. Проверьте правильность написания</span
            >
            <datalist id="streets">
              <option v-for="(street, i) in streets" :key="i">
                {{ street.street }}, {{ street.city }}
              </option>
            </datalist>
          </div>
        </div>
        <div class="sidebar-cart__middle-halfsline">
          <div>
            <label class="input-label input-label--bold" for="house"
              >Дом, корпус</label
            >
            <input
              class="input"
              v-model="address.house"
              type="text"
              id="house"
              required
            />
          </div>
          <div>
            <label class="input-label input-label--bold" for="apartment"
              >Квартира</label
            >
            <input
              class="input"
              v-model="address.apartment"
              type="number"
              min="0"
              id="apartment"
              required
            />
          </div>
        </div>
        <div class="sidebar-cart__middle-halfsline">
          <div>
            <label class="input-label input-label--bold" for="floor"
              >Этаж</label
            >
            <input
              class="input"
              v-model="address.floor"
              type="number"
              min="0"
              id="floor"
            />
          </div>
          <div>
            <label class="input-label input-label--bold" for="entrance"
              >Подъезд</label
            >
            <input
              class="input"
              v-model="address.entrance"
              type="number"
              min="0"
              id="entrance"
            />
          </div>
        </div>
        <div class="sidebar-cart__middle-halfsline">
          <div>
            <label class="input-label input-label--bold" for="code"
              >Код на двери</label
            >
            <input
              class="input"
              v-model="address.intercom"
              type="text"
              id="code"
            />
          </div>
        </div>
        <div class="full-line">
          <label class="input-label input-label--bold" for="comment"
            >Комментарий</label
          >
          <textarea class="input" v-model="address.comment" id="comment" />
        </div>
        <div class="full-line full-line--mobile">
          <button
            @click.prevent="removeAddress()"
            class="button button-default"
          >
            УДАЛИТЬ АДРЕС
          </button>
        </div>
        <div class="full-line full-line--mobile">
          <FormSubmitButton
            class="button-red"
            form="addressForm"
            :isLoading="isLoading.form"
            :text="'СОХРАНИТЬ'"
          />
        </div>
      </form>

      <div class="sidebar-cart__bottom-line">
        <button @click="removeAddress()" class="button button-default">
          УДАЛИТЬ АДРЕС
        </button>
        <FormSubmitButton
          class="button-red"
          form="addressForm"
          :isLoading="isLoading.form"
          :text="'СОХРАНИТЬ'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const geoData = DataFactory.get("geoData");
const users = DataFactory.get("users");
import FormSubmitButton from "@/components/FormSubmitButton.vue";

export default {
  components: {
    FormSubmitButton,
  },
  data() {
    return {
      address: {
        street: "",
        house: "",
        apartment: "",
        entrance: "",
        city: "",
        intercom: "",
        floor: "",
        comment: "",
      },
      addressFromApiError: false,
      addressNotExistError: false,
      streets: [],
      isLoading: {
        remove: false,
        form: false,
      },
      newAddress: this.$route.query.new_address || false,
      editAddress: this.$route.query.address_id || false,
    };
  },
  computed: {
    street() {
      return this.address.street;
    },
  },
  created() {
    if (this.editAddress) {
      this.address = JSON.parse(
        JSON.stringify(
          this.$store.state.userAddresses.find((x) => x.id === this.editAddress)
            .address
        )
      );
      this.address.street = `${this.address.street}, ${this.address.city}`;
    } else if (this.newAddress) return;
    else if (this.$store.state.deliveryAddress !== null) {
      this.address = JSON.parse(
        JSON.stringify(this.$store.state.deliveryAddress)
      );
      this.address.street = `${this.address.street}, ${this.address.city}`;
    }
  },
  watch: {
    street() {
      this.findStreet();
    },
    $route() {
      if ("changeAddress" in this.$route.query) {
        this.$emit("toggleLayers", ["changeAddress"]);
        this.confirmDeliveryAddress();
      }
    },
  },
  methods: {
    removeQuery() {
      const query = Object.assign({}, this.$route.query);
      delete query.new_address;
      delete query.address_id;
      this.$router.replace({ query });
    },
    closeDeliveryAddress() {
      this.removeQuery();
      if (this.editAddress || this.newAddress) {
        this.$emit("toggleLayers", ["addresses", "deliveryAddress"]);
      } else this.$emit("toggleLayers", ["deliveryAddress"]);
    },
    async findStreet() {
      try {
        this.addressFromApiError = false;
        this.addressNotExistError = false;
        if (this.address.street.length > 0) {
          const { data } = await geoData.findStreet(this.address.street);
          this.streets = data.slice(0, 10);
        }
      } catch (e) {
        console.log(e);
      }
    },
    findPlace(street) {
      return this.streets.find((x) => x.street + ", " + x.city === street);
    },
    checkDeliveryZoneExist() {
      if (this.isLoading.form) return;
      this.isLoading.form = true;
      let place = this.findPlace(this.address.street);
      if (place === undefined) {
        this.addressNotExistError = true;
        return;
      }
      let address = JSON.parse(JSON.stringify(this.address));
      address.street = place.street;
      if (
        this.newAddress === false &&
        this.editAddress === false &&
        this.$store.state.deliveryAddress !== null &&
        JSON.stringify(address) !==
          JSON.stringify(this.$store.state.deliveryAddress)
      ) {
        this.$emit("toggleLayers", ["onAddressChange"]);
      } else this.confirmDeliveryAddress();
    },
    async updateUserAddress(deliveryAddress) {
      this.isLoading.form = true;
      await users.updateUserAddress(this.$route.query.address_id, {
        address: deliveryAddress,
      });
      this.isLoading.form = false;
    },
    async confirmDeliveryAddress() {
      try {
        let place = this.findPlace(this.address.street);
        if (place) {
          let deliveryAddress = JSON.parse(JSON.stringify(this.address));

          deliveryAddress.street = place.street;
          deliveryAddress.city = place.city;
          const { data } = await geoData.getGeoData(
            deliveryAddress.city,
            deliveryAddress.street,
            deliveryAddress.house
          );
          deliveryAddress.latitude = data.latitude;
          deliveryAddress.longitude = data.longitude;
          if (this.$store.state.userData !== null) {
            if (this.editAddress) {
              await this.updateUserAddress(deliveryAddress);
              this.closeDeliveryAddress();
              return;
            }
            if (this.newAddress) {
              let { data } = await users.createUserAddress({
                address: deliveryAddress,
              });
              deliveryAddress.internalId = data.id;
              this.removeQuery();
            }
          }

          this.$store.commit("submitDeliveryAddress", deliveryAddress);
          this.$store.commit("changeStateVariable", {
            variable: "deliveryZone",
            data: data,
          });
          if (
            data.deliveryZoneTypes.length === 1 &&
            data.deliveryZoneTypes[0] === "frozen"
          ) {
            let modalData = {
              variable: "modalData",
              data: {
                description:
                  "По вашему адресу доступна доставка только замороженных п/ф",
                buttonText: "ХОРОШО",
                switches: ["modalSwitch"],
              },
            };
            this.$store.commit("changeStateVariable", modalData);
          }
          this.$emit("changeCartItemsAfterChangingAddress");
          if (this.$route.query.account)
            this.$emit("toggleLayers", ["addresses", "deliveryAddress"]);
          else this.$emit("toggleLayers", ["all"]);
        } else {
          this.addressFromApiError = true;
        }
        this.isLoading = false;
      } catch (e) {
        console.log(e);
        if (e.response.status === 404) {
          let modalData = {
            variable: "modalData",
            data: {
              description:
                "Выбранный адрес не входит в зону доставки.\n Пожалуйста, смените адрес доставки. ",
              buttonText: "СМЕНИТЬ АДРЕС",
              switches: ["modalSwitch"],
            },
          };
          this.$store.commit("changeStateVariable", modalData);
        }
      }
    },
    async removeAddress() {
      if (this.isLoading.remove) return;
      this.isLoading.remove = true;
      await users.removeUserAddress(this.$route.query.address_id);
      this.closeDeliveryAddress();
      this.isLoading.remove = false;
    },
  },
};
</script>

<style scoped>
.sidebar-cart__bottom-line > .button:last-child {
  margin-top: 15px;
}
</style>
