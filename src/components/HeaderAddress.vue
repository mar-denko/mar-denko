<template>
  <div class="header__address">
    <template v-if="$store.state.orderInfo.receiveType !== 'delivery'">
      <img class="header__address-image" src="@/assets/icons/cook.svg" />
      <span
        v-if="$store.state.choosenRestaurant !== null"
        class="header__address-text"
        >{{ $store.state.choosenRestaurant.address }}</span
      >
      <span v-else class="header__address-text">Выберите ресторан</span>
      <img
        class="header__address-image"
        src="@/assets/icons/arrow-right-pl-yellow.svg"
      />
    </template>
    <template v-else>
      <img class="header__address-image" src="@/assets/icons/moto.svg" />

      <span
        v-if="$store.state.deliveryAddress !== null"
        class="header__address-text"
        >{{ $store.state.deliveryAddress.street }},
        {{ $store.state.deliveryAddress.house }}</span
      >
      <span v-else class="header__address-text"
        >Выберите адрес для доставки</span
      >
      <img
        class="header__address-image"
        src="@/assets/icons/arrow-right-pl-yellow.svg"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.header__address-text {
  margin: 0 16px;
  font-size: 12px;
  line-height: 16px;
  color: $pl-yellow;
}
</style>
