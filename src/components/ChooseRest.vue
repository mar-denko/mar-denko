<template>
  <div class="sidebar-cart sidebar-cart--full">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="closeModal"
        />
        <span class="sidebar-cart__top-line-title">ВЫБОР РЕСТОРАНА</span>
        <div
          id="mobile-burger"
          @click="closeModal"
          class="mobile-burger change"
        >
          <div class="bar1"></div>
          <div class="bar2"></div>
          <div class="bar3"></div>
        </div>
      </div>
      <div v-if="restaurantList !== null" class="sidebar-cart__middle">
        <PlaceCard
          v-for="(restaurant, i) in restaurantList"
          :key="i"
          @chooseRestaurant="chooseRestaurant"
          :restaurant="restaurant"
          :choosenRestaurant="choosenRestaurant"
        />
        <div class="full-line--mobile">
          <button @click="submitRestaurant()" class="button button-default">
            ВЫБРАТЬ РЕСТОРАН
          </button>
        </div>
      </div>

      <div class="sidebar-cart__bottom-line">
        <button @click="submitRestaurant()" class="button button-default">
          ВЫБРАТЬ РЕСТОРАН
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PlaceCard from "@/components/PlaceCard.vue";
import { DataFactory } from "@/services/Api/DataFactory.js";
const restaurants = DataFactory.get("restaurants");
export default {
  components: {
    PlaceCard,
  },
  data() {
    return {
      restaurantList: null,
      choosenRestaurant: this.$store.state.orderInfo.restaurantId,
      chooseTable: false,
    };
  },
  created() {
    this.getRestaurants();
  },
  methods: {
    async getRestaurants() {
      try {
        this.isLoading = true;
        const { data } = await restaurants.getRestaurants();
        this.restaurantList = data.sort(
          (a, b) => a.sortingNumber - b.sortingNumber
        );
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    closeModal() {
      this.$emit("toggleLayers", ["chooseRestaurant"]);
    },
    chooseRestaurant(id) {
      this.choosenRestaurant = id;
    },
    submitRestaurant() {
      if (this.choosenRestaurant !== null) {
        this.$store.commit("submitRestrant", {
          restaurantId: this.choosenRestaurant,
          restaurant: this.restaurantList.find(
            (x) => x.id === this.choosenRestaurant
          ),
        });
        if (this.$store.state.orderInfo.receiveType === "pick-up")
          this.$emit("toggleLayers", ["chooseRestaurant"]);
        else {
          this.$emit("toggleLayers", ["chooseTable"]);
        }
      } else this.$store.commit("changeReceiveType", "delivery");
    },
  },
};
</script>
