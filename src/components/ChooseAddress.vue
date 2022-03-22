<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['chooseAddress'])"
        />
        <span class="sidebar-cart__top-line-title">АДРЕСА ДОСТАВКИ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['chooseAddress'])"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <div v-if="isLoading" class="sidebar-cart__middle loader-wrapper">
        <circles-to-rhombuses-spinner
          :animation-duration="1200"
          :circles-num="3"
          :circle-size="15"
          color="#585854"
        />
      </div>
      <template v-else>
        <div class="sidebar-cart__middle">
          <AddressesList
            v-if="userAddresses !== null"
            :userAddresses="userAddresses"
            :checkedAddress="checkedAddress"
            @checkAddress="checkAddress"
          />
          <div class="full-line--mobile">
            <button @click="confirmAddress" class="button button-red">
              СОХРАНИТЬ
            </button>
          </div>
        </div>
        <div class="sidebar-cart__bottom-line">
          <button @click="confirmAddress" class="button button-red">
            СОХРАНИТЬ
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const geoData = DataFactory.get("geoData");
const users = DataFactory.get("users");
import AddressesList from "@/components/account/AddressesList.vue";
import { CirclesToRhombusesSpinner } from "epic-spinners";
export default {
  components: {
    AddressesList,
    CirclesToRhombusesSpinner,
  },
  data() {
    return {
      user: this.$store.state.userData,
      userAddresses: null,
      isLoading: false,
      checkedAddress: this.$store.state.deliveryAddress
        ? this.$store.state.deliveryAddress.internalId
        : null,
    };
  },
  created() {
    this.getUserAddresses();
  },
  watch: {
    "$store.state.deliveryAddress"() {
      this.getUserAddresses();
      this.checkedAddress = this.$store.state.deliveryAddress
        ? this.$store.state.deliveryAddress.internalId
        : null;
    },
  },
  methods: {
    checkAddress(data) {
      this.checkedAddress = data;
    },
    async confirmAddress() {
      let deliveryAddress = this.userAddresses.find(
        (item) => item.id === this.checkedAddress
      ).address;
      const { data } = await geoData.getGeoData(
        deliveryAddress.city,
        deliveryAddress.street,
        deliveryAddress.house
      );
      deliveryAddress.internalId = this.checkedAddress;
      deliveryAddress.latitude = data.latitude;
      deliveryAddress.longitude = data.longitude;
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
      this.$emit("toggleLayers", ["chooseAddress"]);
    },
    async getUserAddresses() {
      this.isLoading = true;
      const { data } = await users.getUserAddresses();
      this.userAddresses = data;
      this.$store.commit("changeStateVariable", {
        variable: "userAddresses",
        data: data,
      });
      this.isLoading = false;
    },
  },
};
</script>
