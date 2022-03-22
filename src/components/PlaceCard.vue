<template>
  <div
    :class="{
      'place-card__active': choosenRestaurant === restaurant.id,
    }"
    @click="$emit('chooseRestaurant', restaurant.id)"
    class="place-card"
  >
    <span class="place-card__name">{{ restaurant.name }}</span>
    <div class="place-card__line">
      <img class="place-card__metro" src="@/assets/icons/metro.svg" />
      <span class="place-card__text">{{ restaurant.metroStation }}</span>
    </div>
    <span class="place-card__text">{{ restaurant.address }}</span>
    <img
      v-if="choosenRestaurant === restaurant.id"
      class="place-card__check"
      src="@/assets/icons/check.svg"
    />
  </div>
</template>

<script>
export default {
  props: {
    restaurant: Object,
    choosenRestaurant: Number,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.place-card {
  background: $pl-white;
  box-shadow: 0px 1px 34px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  color: $pl-gray;
  font-weight: normal;
  position: relative;
  cursor: pointer;
  &__active {
    border: 1px solid $pl-red;
  }
  &__name {
    font-size: 14px;
    line-height: 18px;
    margin-bottom: 6px;
  }
  &__line {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  &__metro {
    margin-right: 8px;
  }
  &__text {
    font-size: 14px;
    line-height: 18px;
  }
  &__check {
    position: absolute;
    right: 20px;
    top: 40%;
  }
}
</style>
