<template>
  <div class="modal-layer">
    <div v-if="$store.state.modalData !== null" class="modal-card">
      <div
        id="mobile-burger"
        @click="$emit('toggleLayers', ['modalSwitch'])"
        class="mobile-burger change"
      >
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
      <span v-if="$store.state.modalData.title" class="modal-card__title">{{
        $store.state.modalData.title
      }}</span>
      <span
        v-if="$store.state.modalData.description"
        class="modal-card__description"
        >{{ $store.state.modalData.description }}</span
      >
      <button
        v-if="$store.state.modalData.switches"
        @click="$emit('toggleLayers', $store.state.modalData.switches)"
        class="button button-red"
      >
        {{ $store.state.modalData.buttonText }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.mobile-burger {
  position: absolute;
  top: 14px;
  right: 9px;
}
.modal {
  &-layer {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 102;
  }
  &-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: $pl-white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    position: relative;
    box-sizing: border-box;
    padding: 30px 50px 30px;
    width: 90%;
    max-width: 400px;
    font-size: 14px;
    line-height: 19px;

    &__title {
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 25px;
      @media (min-width: $viewport--xl) {
        font-size: 17px;
      }
    }
    &__description {
      font-weight: normal;
      margin-bottom: 30px;
      text-align: center;
      white-space: pre-line;
    }
  }
}
</style>
