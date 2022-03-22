<template>
  <div class="addresses-list">
    <div
      v-for="item in userAddresses"
      :key="item.id"
      class="addresses-list__item"
      @click="switcher(item.id)"
    >
      <div class="addresses-list__item--left">
        {{ item.address.street }}, {{ item.address.house }},
        {{ item.address.apartment }}
      </div>
      <div
        v-if="item.id === checkedAddress"
        class="addresses-list__item--right"
      >
        <img src="@/assets/icons/check.svg" alt="add" />
      </div>
    </div>
    <div @click="newAddress" class="addresses-list__item">
      <div class="addresses-list__item--left">Добавить новый адрес</div>
      <div class="addresses-list__item--right">
        <img src="@/assets/icons/plus.svg" alt="add" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userAddresses: Array,
    checkedAddress: String,
  },
  data() {
    return {
      isLoading: false,
      checkAddress: Boolean(this.$route.query.chooseAddress),
    };
  },
  methods: {
    switcher(id) {
      if (this.checkAddress) {
        this.$emit(
          "checkAddress",
          this.userAddresses.find((item) => item.id === id).id
        );
        this.$forceUpdate();
      } else this.editAddress(id);
    },
    editAddress(id) {
      const query = {
        ...this.$route.query,
        address_id: id,
      };
      this.$router.replace({
        query,
      });
      this.$parent.$emit("toggleLayers", ["addresses", "deliveryAddress"]);
    },
    newAddress() {
      const query = {
        ...this.$route.query,
        new_address: true,
      };
      this.$router.replace({
        query,
      });
      if (this.$route.query.chooseAddress)
        this.$parent.$emit("toggleLayers", ["deliveryAddress"]);
      else {
        this.$parent.$emit("toggleLayers", ["addresses", "deliveryAddress"]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.addresses-list {
  background: $pl-white;
  border-radius: 20px;
  padding: 0 12px;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 15px 0;
    box-sizing: border-box;
    &:not(:last-child) {
      border-bottom: 1px solid rgba(88, 88, 84, 0.5);
    }
    &--right {
      display: flex;
      align-items: center;
    }
  }
}
</style>
