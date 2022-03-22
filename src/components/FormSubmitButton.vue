<template>
  <button
    type="submit"
    :class="{ 'button--half-opacity': isLoading }"
    class="button"
  >
    <circles-to-rhombuses-spinner
      v-if="isLoading"
      :animation-duration="1200"
      :circles-num="3"
      :circle-size="15"
      color="#f6ddaa"
    />
    <template v-else>{{ text }}</template>
  </button>
</template>

<script>
import { CirclesToRhombusesSpinner } from "epic-spinners";
export default {
  components: {
    CirclesToRhombusesSpinner,
  },
  props: {
    isLoading: Boolean,
    text: String,
  },
};
</script>
