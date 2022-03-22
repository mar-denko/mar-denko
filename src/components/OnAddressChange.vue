<template>
  <div class="sidebar-cart sidebar-cart--full">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__middle">
        <img src="@/assets/stonedGuyGray.png" class="image" />
        <span class="sidebar-cart__top-line-title">Смена адреса доставки</span>
        <span class="description"
          >Возможна потеря части заказа.<br />Сменить адрес доставки?</span
        >
        <div class="line">
          <button @click="addressChanger(true)" class="button button-default">
            ДА
          </button>
          <button @click="addressChanger(false)" class="button button-red">
            НЕТ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addressChanger(bool) {
      if (bool)
        this.$emit("toggleLayers", ["onAddressChange", "changeAddress"]);
      else this.$emit("toggleLayers", ["onAddressChange"]);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.sidebar-cart__middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.image {
  @media (min-width: $viewport--md) {
    width: 250px;
  }
}
.button {
  min-width: 160px;
  width: 160px;
}
.description {
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 40px;
  text-align: center;
}
.line {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}
</style>
