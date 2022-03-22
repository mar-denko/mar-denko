<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['addresses'])"
        />
        <span class="sidebar-cart__top-line-title">АДРЕСА ДОСТАВКИ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['addresses'])"
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
      <div v-else class="sidebar-cart__middle">
        <AddressesList :userAddresses="userAddresses" />
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
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
      userAddresses: null,
      isLoading: false,
    };
  },
  created() {
    this.getUserAddresses();
  },
  methods: {
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
