<template>
  <div class="sidebar-cart sidebar-cart--full">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="closeChooseTable"
        />
        <span class="sidebar-cart__top-line-title">ЗАКАЗ НА СТОЛ</span>
        <div
          id="mobile-burger"
          @click="closeChooseTable"
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
        <form
          @submit.prevent="submitTable"
          id="submutTableForm"
          class="sidebar-cart__middle"
        >
          <PlaceCard :restaurant="$store.state.choosenRestaurant" />
          <div class="sidebar-cart__middle-halfsline">
            <div v-if="tables !== null">
              <label class="input-label" for="table">Номер стола</label>
              <select
                v-if="tables.length > 0"
                class="input"
                id="table"
                required
                v-model="tableId"
              >
                <option
                  :key="table.id"
                  v-for="table in tables"
                  :value="table.id"
                >
                  {{ table.name }}
                </option>
              </select>
              <div v-else>Столы отсутствуют</div>
            </div>
            <div>
              <label class="input-label" for="quests">Кол-во гостей</label>
              <input
                class="input"
                type="number"
                id="quests"
                v-model="guestsCount"
                min="1"
                step="1"
                required
              />
            </div>
          </div>
          <div class="full-line full-line--mobile">
            <button
              v-if="tables.length === 0"
              class="button button-default"
              @click="closeChooseTable"
            >
              ЗАКРЫТЬ
            </button>
            <button
              v-else
              type="submit"
              form="submutTableForm"
              class="button button-default"
            >
              ВЫБРАТЬ ЗАКАЗ НА СТОЛ
            </button>
          </div>
        </form>
        <div class="sidebar-cart__bottom-line">
          <button
            v-if="tables.length === 0"
            class="button button-default"
            @click="closeChooseTable"
          >
            ЗАКРЫТЬ
          </button>
          <button
            v-else
            type="submit"
            form="submutTableForm"
            class="button button-default"
          >
            ВЫБРАТЬ ЗАКАЗ НА СТОЛ
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import PlaceCard from "@/components/PlaceCard.vue";
import { CirclesToRhombusesSpinner } from "epic-spinners";
import { DataFactory } from "@/services/Api/DataFactory.js";
const restaurants = DataFactory.get("restaurants");
export default {
  components: {
    PlaceCard,
    CirclesToRhombusesSpinner,
  },
  data() {
    return {
      tableId: "",
      guestsCount: 1,
      isLoading: false,
      tables: null,
    };
  },
  created() {
    this.getTables();
  },
  methods: {
    async getTables() {
      try {
        this.isLoading = true;
        const { data } = await restaurants.getRestaurantTables(
          this.$store.state.choosenRestaurant.id
        );
        this.tables = data.sort((a, b) => a.name - b.name);
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    closeChooseTable() {
      if (this.$store.state.orderInfo.tableId === null)
        this.$store.commit("submitRestrant", {
          restaurantId: null,
          restaurant: null,
        });
      this.$emit("toggleLayers", ["chooseTable", "chooseRestaurant"]);
    },
    submitTable() {
      this.$store.commit("submitTable", {
        guestsCount: this.guestsCount,
        tableId: this.tableId,
        tableNumber: this.tables.find((table) => table.id === this.tableId)
          .name,
      });
      this.$emit("toggleLayers", ["chooseTable", "chooseRestaurant"]);
    },
  },
};
</script>
