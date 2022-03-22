<template>
  <div class="receive-type-switcher">
    <div
      v-for="(type, i) in $store.state.receiveTypes"
      :key="type.id"
      @click="
        $store.commit('changeReceiveType', type.id);
        $store.commit('changePaymentType', 'online');
      "
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
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.receive-type-switcher {
  display: flex;
  align-items: center;
  width: 343px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.05em;
  color: $pl-yellow;
  @media (max-width: $viewport--md) {
    width: 100%;
  }

  & * {
    flex: 1 0 0;
    border: 1px solid $pl-yellow;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-transform: uppercase;
  }
  &__active {
    background: $pl-yellow;
    color: $pl-gray;
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
}
</style>
