<template>
  <div class="sidebar-cart">
    <div class="sidebar-cart-wrapper">
      <div class="sidebar-cart__top-line">
        <img
          class="sidebar-cart__top-line-back"
          src="@/assets/icons/arrow-left.svg"
          @click="$emit('toggleLayers', ['bonusHistory'])"
        />
        <span class="sidebar-cart__top-line-title">ИСТОРИЯ БОНУСОВ</span>
        <div
          id="mobile-burger"
          @click="$emit('toggleLayers', ['bonusHistory'])"
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
        <div v-if="bonuses.length === 0">Бонусы не найдены</div>
        <div v-else v-for="(bonus, i) in bonuses" :key="i" class="bonus-card">
          <div class="bonus-card__top">{{ bonus.localDate }}</div>
          <div class="bonus-card__bottom">
            <template v-if="bonus.value > 0">
              <div class="bonus-card__left bonus-card__text">
                Получено бонусов:
              </div>
              <div class="bonus-card__right bonus-card__text">
                + {{ bonus.value }} ₽
              </div>
            </template>
            <template v-else>
              <div
                class="bonus-card__left bonus-card__text bonus-card__text--red"
              >
                Потрачено бонусов:
              </div>
              <div
                class="bonus-card__right bonus-card__text bonus-card__text--red"
              >
                {{ bonus.value }} ₽
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const users = DataFactory.get("users");
import { CirclesToRhombusesSpinner } from "epic-spinners";
export default {
  components: {
    CirclesToRhombusesSpinner,
  },
  data() {
    return {
      bonuses: null,
      isLoading: false,
    };
  },
  created() {
    this.getBonusHistory();
  },
  methods: {
    async getBonusHistory() {
      this.isLoading = true;
      const { data } = await users.getUsersBonusHistory();
      this.bonuses = data;
      this.bonuses.forEach((bonus) => {
        const bonusDate = new Date(bonus.date).toLocaleString([], {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        const bonusTime = new Date(bonus.date).toLocaleString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        bonus.localDate = `${bonusDate} г. в ${bonusTime}`;
      });
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.bonus-card {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 1px 34px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  background: $pl-white;
  padding: 10px 12px 20px;
  &__text {
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    @media (min-width: $viewport--md) {
      font-size: 14px;
      line-height: 19px;
    }
    &--red {
      color: $pl-red;
    }
  }
  &__top {
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    border-bottom: 0.5px solid #c9c6bf;
    padding-bottom: 5px;
  }
  &__bottom {
    display: flex;
    flex-direction: row;
    margin-top: 9px;
  }
  &__left {
    margin-right: 80px;
  }
}
</style>
