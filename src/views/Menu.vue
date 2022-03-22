<template>
  <div class="menuPage">
    <div v-if="isLoading" class="loader-wrapper">
      <circles-to-rhombuses-spinner
        :animation-duration="1200"
        :circles-num="3"
        :circle-size="15"
        color="#f6ddaa"
      />
    </div>
    <template v-else>
      <div class="page-wrapper">
        <div v-if="lastAdded !== null" class="to-cart">
          <span class="to-cart__title">Добавлено:</span>
          <div
            v-for="option in lastAdded.options.filter((x) => x.counter !== 0)"
            :key="option.id"
            class="to-cart__item"
          >
            <span class="to-cart__item-name"
              >{{ option.name }} {{ option.group_name }}</span
            >
            <span class="to-cart__item-count"
              >{{ option.counter }}х{{
                option.servings.find((x) => x.selected === true).quantity
              }}
              {{
                option.servings.find((x) => x.selected === true).measure
              }}</span
            >
          </div>
        </div>
        <button class="page__button" @click="menuOpened = !menuOpened">
          {{ menuOpened ? "Закрыть" : "Меню" }}
        </button>
        <transition name="fade">
          <div v-if="menuOpened" class="menu">
            <div class="menu__wrapper">
              <div
                v-for="(item, i) in groups"
                @click="menuSwitcher(item.id)"
                :key="i"
                class="menu__item"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </transition>
        <template v-if="choosenGroup !== null">
          <div class="page-title">
            <h2 class="page__name">{{ choosenGroup.name }}</h2>
            <router-link
              v-if="choosenGroup.recipe !== '' || choosenGroup.recipeUrl !== ''"
              :to="{
                name: 'howTo',
                params: { groupId: choosenGroup.id },
              }"
              tag="div"
              class="page__howto"
              ><img
                class="page__howto-icon"
                src="@/assets/icons/HowToCook.svg"
                alt="howto"
              />Как приготовить?</router-link
            >
          </div>
          <div class="items">
            <div
              class="item"
              v-for="(position, i) in choosenGroup.positions"
              :key="i"
            >
              <div class="item-wrapper">
                <img
                  v-if="position.image === null"
                  src="@/assets/stonedGuy.png"
                  class="item__image"
                  @click="openPosition(position)"
                />
                <img
                  v-else
                  v-lazy="position.image"
                  class="item__image"
                  @click="openPosition(position)"
                />
                <div class="item__name-row">
                  <span class="item__name" @click="openPosition(position)">{{
                    position.name
                  }}</span>
                  <div class="item__info">
                    <img src="@/assets/icons/info.svg" />
                    <transition name="fade">
                      <div class="item__nutriens">
                        <span class="nutriens__title"
                          >Энергетическая ценность на 100 г</span
                        >
                        <div class="nutriens__values">
                          <div class="nutriens__value-wrapper">
                            <span class="nutriens__value-title">Белки</span>
                            <span class="nutriens__value"
                              >{{ position.protein }} г</span
                            >
                          </div>
                          <div class="nutriens__value-wrapper">
                            <span class="nutriens__value-title">Жиры</span>
                            <span class="nutriens__value"
                              >{{ position.fat }} г</span
                            >
                          </div>
                          <div class="nutriens__value-wrapper">
                            <span class="nutriens__value-title">Углеводы</span>
                            <span class="nutriens__value"
                              >{{ position.carbohydrate }} г</span
                            >
                          </div>
                          <div class="nutriens__value-wrapper">
                            <span class="nutriens__value-title"
                              >Калорийность</span
                            >
                            <span class="nutriens__value"
                              >{{ position.calories }} ккал</span
                            >
                          </div>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>

                <p class="item__description">
                  {{ position.description }}
                </p>
                <transition name="fade">
                  <div
                    :key="position.opened"
                    v-if="position.opened"
                    :class="{
                      'item__servings-disabled': positionOptionsDisableSwitcher,
                    }"
                    class="item__servings"
                  >
                    <div
                      class="item__serving"
                      v-for="(option, j) in position.options"
                      :key="j"
                      :class="{
                        'item__serving-disabled':
                          !checkDeliveryZoneTypes(option),
                      }"
                    >
                      <span class="serving__name">{{ option.name }}</span>
                      <div class="serving__picker">
                        <div class="serving__picker-left">
                          <div
                            class="serving__portion"
                            v-for="(serving, k) in option.servings"
                            :key="k"
                          >
                            <template v-if="serving.price !== null">
                              <span class="portion__measure">{{
                                serving.measure
                              }}</span>
                              <span
                                @click="checkPortion(option, serving)"
                                :class="{
                                  'portion__volume-selected': serving.selected,
                                }"
                                class="portion__volume"
                                >{{ serving.quantity }}</span
                              >
                              <span class="portion__price"
                                >{{ serving.price }} р.</span
                              >
                            </template>
                          </div>
                        </div>
                        <div class="serving__picker-right">
                          <span class="portion__counter-title"
                            >Кол-во порций</span
                          >
                          <div class="portion__counter">
                            <span
                              @click="coastChange(option, -1)"
                              class="portion__counter-button"
                              >–</span
                            >
                            <span>{{ option.counter }}</span>
                            <span
                              @click="coastChange(option, 1)"
                              class="portion__counter-button"
                              >+</span
                            >
                          </div>
                          <span class="portion__price"
                            >{{ option.coast }} р.</span
                          >
                        </div>
                      </div>
                    </div>
                    <button
                      @click="if (!lastAdded) addToCart(position);"
                      class="page__button page__button--red"
                    >
                      {{
                        lastAdded && position.id === lastAdded.id
                          ? "Добавлено"
                          : "Добавить в корзину"
                      }}
                    </button>
                  </div>
                </transition>
                <button
                  class="page__button item__button"
                  @click="openPosition(position)"
                >
                  {{ position.opened ? "Свернуть" : "Выбрать блюдо" }}
                </button>
              </div>
            </div>
            <template v-if="choosenGroup.positions.length / 3 !== 0">
              <div class="item item-empty"></div>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { DataFactory } from "@/services/Api/DataFactory.js";
const groups = DataFactory.get("groups");
const dicts = DataFactory.get("dicts");

import { CirclesToRhombusesSpinner } from "epic-spinners";

export default {
  name: "Home",
  components: {
    CirclesToRhombusesSpinner,
  },
  data() {
    return {
      menuOpened: false,
      groups: null,
      choosenGroup: null,
      measures: null,
      lastAdded: null,
      isLoading: false,
      positionOpened: false,
    };
  },
  watch: {
    "$route.query": {
      handler: function () {
        if (this.$route.query.openMenu) {
          this.menuOpened = true;
          const query = Object.assign({}, this.$route.query);
          delete query.openMenu;
          this.$router.replace({ query });
          this.checkGroup();
          this.getPositions();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    await this.getMeasures();
    await this.getGroups();
    this.checkGroup();
    await this.getPositions();
  },
  computed: {
    //computed и watch нужны для изменения интерфейса, если что-то добавили в корзине
    cart() {
      return this.$store.getters.getCartList;
    },
    positionOptionsDisableSwitcher() {
      let state = this.$store.state;
      let result =
        (state.orderInfo.receiveType === "delivery" &&
          state.deliveryZone === null) ||
        (state.orderInfo.receiveType === "pick-up" &&
          state.choosenRestaurant === null) ||
        (state.orderInfo.receiveType === "restaurant" &&
          state.orderInfo.tableId === null);
      return result;
    },
  },
  methods: {
    checkDeliveryZone() {
      if (this.positionOptionsDisableSwitcher) {
        let getSwitch =
          this.$store.state.orderInfo.receiveType === "delivery"
            ? {
                switch: "deliveryAddress",
                text: "Для добавления в корзину вам необходимо ввести адрес доставки",
              }
            : {
                switch: "chooseRestaurant",
                text: "Для добавления в корзину вам необходимо выбрать ресторан",
              };
        let modalData = {
          variable: "modalData",
          data: {
            description: getSwitch.text,
            buttonText: "ВВЕСТИ АДРЕС",
            switches: ["modalSwitch", getSwitch.switch],
          },
        };
        this.$store.commit("changeStateVariable", modalData);
        this.$emit("toggleLayers", ["modalSwitch"]);
        return false;
      }
      return true;
    },
    addToCart(item) {
      if (
        this.checkDeliveryZone() &&
        item.options.find((option) => option.counter !== 0)
      ) {
        item.options.forEach((option) =>
          option.servings.forEach(
            (serving) => (serving.counter = option.counter)
          )
        );
        this.lastAdded = JSON.parse(JSON.stringify(item));
        setTimeout(() => (this.lastAdded = null), 3000);
        this.$store.commit("addToCart", item);
        item.options.forEach((option) => {
          option.counter = 0;
          option.coast = 0;
          option.servings.forEach((serving) => (serving.selected = false));
        });
      }
    },
    menuSwitcher(id) {
      this.$router.replace({ params: { groupId: id } });
      this.getPositions();
      this.menuOpened = !this.menuOpened;
    },
    openPosition(position) {
      position.opened = !position.opened;
      this.positionOpened = !this.positionOpened;
      this.$forceUpdate();
    },
    async getMeasures() {
      try {
        this.isLoading = true;
        const { data } = await dicts.getMeasures();
        this.measures = data;
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    async getGroups() {
      try {
        this.isLoading = true;
        const { data } = await groups.getGroups();
        this.groups = data.sort((a, b) => a.sortingNumber - b.sortingNumber);
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    checkGroup() {
      if (!this.groups.find((x) => x.id === this.$route.params.groupId)) {
        this.$router.push({ params: { groupId: this.groups[0].id } });
      }
    },
    async getPositions() {
      try {
        this.isLoading = true;
        let data = await groups.getGroup(this.$route.params.groupId);
        this.choosenGroup = data.data;
        this.choosenGroup.positions.sort(
          (a, b) => a.sortingNumber - b.sortingNumber
        );
        //добавляем позициям необходимые параметры для работы
        this.choosenGroup.positions.forEach((position) => {
          if (position.image)
            position.image = `${this.$store.state.baseURL}${position.image}`;
          position.options.forEach((y) => {
            y.group_name = position.name;
            y.counter = 0;
            y.coast = 0;
            y.selectedPrice = 0;
            y.servings.forEach((z) => {
              z.selected = false;

              z.measure = this.measures.find(
                (l) => l.id === z.measureId
              ).shortName;
            });
          });
          position.opened = false;
        });
        //сортируем опции
        this.choosenGroup.positions.forEach((x) => {
          x.options.sort((a, b) => a.sortingNumber - b.sortingNumber);
        });
        //сортируем варианты по количеству
        this.choosenGroup.positions.forEach((x) => {
          x.options.forEach((y) => {
            y.servings.sort((a, b) => a.quantity - b.quantity);
          });
        });
        this.isLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    checkDeliveryZoneTypes(option) {
      if (
        this.$store.state.orderInfo.receiveType === "delivery" &&
        this.$store.state.deliveryZone &&
        option.deliveryZoneTypes.find((zone) => {
          return (
            this.$store.state.deliveryZone.deliveryZoneTypes.indexOf(zone) ===
            -1
          );
        })
      ) {
        return false;
      } else {
        return true;
      }
    },
    checkPortion(option, serving) {
      if (this.checkDeliveryZone() && this.checkDeliveryZoneTypes(option)) {
        option.servings
          .filter((y) => y.tillypadId !== serving.tillypadId)
          .forEach((x) => (x.selected = false));
        serving.selected = !serving.selected;
        if (serving.selected) {
          option.selectedPrice = serving.price;
          option.counter = 1;
        } else {
          option.selectedPrice = 0;
          option.counter = 0;
        }

        option.coast = option.counter * option.selectedPrice;
        this.$forceUpdate();
      }
    },
    coastChange(option, i) {
      if (option.servings.find((x) => x.selected)) {
        if (option.counter + i >= 0) {
          option.counter += i;
          option.coast = option.counter * option.selectedPrice;
        }
        if (option.counter === 0) {
          option.servings.forEach((x) => (x.selected = false));
        }
      }
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, height 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  height: 0;
}
.portion {
  line-height: 25px;
  &__measure {
    text-transform: capitalize;
    font-size: 12px;
    margin-bottom: 5px;
  }
  &__counter {
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: space-around;
    align-items: center;
    border-radius: 20px;
    border-color: $pl-yellow;
    background-color: $pl-yellow;
    height: 40px;
    width: 112px;
    font-weight: 500;
    font-size: 20px;
    border-radius: 20px;
    color: $pl-gray;
    user-select: none;
    margin-bottom: 10px;
    &-button {
      cursor: pointer;
    }
    &-title {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
  &__volume {
    font-weight: 500;
    font-size: 20px;
    border-radius: 20px;
    border-color: $pl-yellow;
    background-color: $pl-yellow;
    width: 40px;
    height: 40px;
    color: $pl-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    cursor: pointer;
    &-selected {
      border-color: $pl-red;
      background-color: $pl-red;
      color: $pl-yellow;
    }
  }
  &__price {
    font-weight: 500;
    font-size: 13px;
  }
}
.serving {
  &__name {
    font-weight: 600;
    font-size: 14px;
    line-height: 25px;
  }
  &__picker {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    margin-top: 15px;
    &-left {
      display: flex;
      flex-direction: row;
    }
    &-right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  &__portion {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
.menuPage {
  background-color: $pl-gray;
  color: $pl-yellow;
  min-height: calc(100vh - 225px - var(--headerHeight));
}
.header-toggler {
  background: $pl-yellow !important;
}
.to-cart {
  position: fixed;
  width: inherit;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  color: $pl-yellow;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  @media (min-width: $viewport--md) {
    width: 500px;
    right: 2.5%;
  }
  @media (min-width: $viewport--lg) {
    right: 50%;
    transform: translateX(110%);
  }
  & > * {
    margin-bottom: 12px;
  }
  &__title {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    font-weight: normal;
    font-size: 10px;
    line-height: 12px;
    @media (min-width: $viewport--lg) {
      font-size: 12px;
      line-height: 14px;
    }
    &-name {
      font-weight: 500;
    }
  }
}
.items {
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: $viewport--md) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  @media (min-width: $viewport--xl) {
  }
  .item {
    margin-bottom: 30px;
    @media (min-width: $viewport--md) {
      width: 45%;
    }
    @media (min-width: $viewport--lg) {
      width: 30%;
    }
    &-empty {
      visibility: hidden;
    }
    &__button {
      margin-bottom: 0;
    }
    &__info {
      float: right;
      position: relative;
      &:hover {
        .item__nutriens {
          display: block;
        }
      }
    }
    &-wrapper {
      height: 100%;
    }
    &__nutriens {
      position: absolute;
      height: 0;
      display: none;
      height: auto;
      width: 300px;
      padding: 5px 20px 10px;
      right: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 10px;
      & .nutriens {
        color: $pl-yellow;
        &__title {
          font-weight: 600;
          font-size: 14px;
          line-height: 25px;
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        &__values {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
        &__value {
          font-size: 12px;
          line-height: 14px;
          font-weight: normal;
          &-title {
            font-size: 12px;
            line-height: 14px;
            font-weight: 500;
          }
          &-wrapper {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex-wrap: nowrap;
          }
        }
      }
    }
    &__name {
      font-weight: 700;
      line-height: 19px;
      text-decoration-line: underline;
      text-transform: uppercase;
      cursor: pointer;
      width: 85%;
      display: inline-block;
      &-row {
        height: 57px;
        @media (max-width: $viewport--md) {
          height: auto;
        }
      }
    }
    &__description {
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      white-space: pre-line;
      height: 60px;
      @media (max-width: $viewport--md) {
        height: auto;
      }
      @media (min-width: $viewport--xl) {
        line-height: 16px;
      }
    }
    &__image {
      width: 100%;
      height: auto;
      margin-bottom: 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    &__servings {
      &-disabled {
        opacity: 0.5;
      }
    }
    &__serving {
      border-top: 1px solid $pl-yellow;
      padding: 10px 0;
      &:last-of-type {
        margin-bottom: 10px;
      }
      &-disabled {
        opacity: 0.5;
      }
    }
  }
}
.menu {
  background-color: $pl-gray;
  &__title {
    width: 100%;
    margin: 0;
    padding: 20px 0;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 0.1em;
    text-decoration: underline;
    text-align: center;
    color: $pl-yellow;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    @media (min-width: $viewport--md) {
      justify-content: flex-start;
      gap: 2%;
    }
  }
  &__item {
    width: 49%;
    color: $pl-yellow;
    font-weight: bold;
    font-size: 14px;
    line-height: 19px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: 1px solid #f6ddaa;
    box-sizing: border-box;
    border-radius: 100px;
    padding: 13px 0;
    text-align: center;
    margin-bottom: 18px;
    cursor: pointer;
    @media (min-width: $viewport--md) {
      width: 23%;
    }
    @media (min-width: $viewport--lg+1) {
      width: 15%;
    }
  }
}
</style>
