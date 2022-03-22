import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});
const getDefaultState = () => {
  return {
    windowWidth: window.innerWidth,
    baseURL: `${process.env.VUE_APP_API_IP}/v1/files/images/`,
    cart: [],
    cartCount: 0,
    cartPrice: 0,
    orderInfo: {
      receiveType: "delivery",
      receiveTime: null,
      restaurantId: null,
      paymentType: "online",
      guestName: "",
      guestPhone: "",
      guestsCount: 0,
      comment: "",
      confirmCall: false,
      tableId: null,
      tableNumber: null,
    },
    userData: null,
    userAddresses: null,
    choosenRestaurant: null,
    receiveTypes: null,

    deliveryAddress: null,
    deliveryZone: null,
    modalData: null,
    toggleOrder: [],
    darkLayerExist: false,
    newUserData: null,
    orderFromApi: null,
    recoveryUser: null,
    headerOpened: true,
  };
};

export default new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: getDefaultState(),
  mutations: {
    getOrder(state) {
      state.cart.forEach((cartItem) => {
        cartItem.options.forEach((option) => {
          if (option.counter > 0) {
            let choosenOption = option.servings.find(
              (serving) => serving.selected === true
            );
            state.orderInfo.order.push({
              positionOptionServigId: choosenOption.tillypadId,
              number: option.counter,
            });
          }
        });
      });
    },
    changeStateVariable(state, payload) {
      state[payload.variable] = payload.data;
    },
    changeToggleOrder(state, payload) {
      state.toggleOrder = payload;
    },
    changeReceiveType(state, payload) {
      state.orderInfo.receiveType = payload;
    },
    changeConfirmationCall(state, payload) {
      state.orderInfo.confirmCall = payload;
    },
    changeGuestData(state, payload) {
      state.orderInfo[payload.variable] = payload.data;
    },
    changePaymentType(state, payload) {
      state.orderInfo.paymentType = payload;
    },
    changeGuestsCount(state, i) {
      if (state.orderInfo.guestsCount + i >= 0)
        state.orderInfo.guestsCount =
          parseInt(state.orderInfo.guestsCount) + parseInt(i);
    },
    coastChange(state, data) {
      if (data.item.counter + data.i >= 0) {
        data.item.counter += data.i;
      }
      if (data.item.counter === 0) {
        data.item.selected = false;
      }
      //проверяем на удаление
      state.cart.forEach((option) => {
        option.servings.forEach((serving) =>
          serving.counter === 0 ? (serving.remove = true) : false
        );
      });
      //удаляем лишние все сразу
      state.cart.forEach(
        (option) =>
          (option.servings = option.servings.filter(
            (serving) => serving.remove === undefined
          ))
      );
      //удаляем из корзины если нет вариантов сервировки
      state.cart = state.cart.filter((option) => option.servings.length !== 0);
      this.commit("priceChanged");
    },
    priceChanged(state) {
      let cartPrice = 0,
        cartCount = 0;

      //пересчет количества и общей стоимости айтемов
      state.cart.forEach((option) => {
        option.servings.forEach((serving) => {
          cartPrice += serving.counter * serving.price;
          serving.counter !== 0 ? cartCount++ : false;
        });
      });
      state.cartPrice = cartPrice;
      state.cartCount = cartCount;
    },
    addToCart(state, itemFromMenu) {
      //раньше хранил весь item, но корзина забивала весь localstorage. Потому очищаем от ненужного
      let item = JSON.parse(JSON.stringify(itemFromMenu));
      item.options.forEach(
        (z) => (z.servings = z.servings.filter((k) => k.selected === true))
      );
      //проверяем на наличие того же айтема в корзине. Заменяем если есть
      for (let i = 0; i < item.options.length; i++) {
        let itemIndexCart = state.cart.findIndex(
          (x) => x.id === item.options[i].id
        );
        //если новый товар
        if (itemIndexCart === -1 && item.options[i].counter !== 0)
          state.cart.push(item.options[i]);
        //если в старом товаре добавились или изменились варианты подачи
        if (itemIndexCart !== -1 && item.options[i].counter !== 0) {
          let servingIndexInServings = state.cart[itemIndexCart].servings.find(
            (x) => x.id === item.options[i].servings[0].id
          );
          //если изменилось количество в старом
          if (servingIndexInServings)
            servingIndexInServings.counter +=
              item.options[i].servings[0].counter;
          //если добавился вариант подачи
          else {
            state.cart[itemIndexCart].servings.push(
              item.options[i].servings[0]
            );
          }
        }
      }
      this.commit("priceChanged");
    },
    submitRestrant(state, payload) {
      state.orderInfo.restaurantId = payload.restaurantId;
      state.choosenRestaurant = payload.restaurant;
    },
    submitTable(state, payload) {
      state.orderInfo.guestsCount = payload.guestsCount;
      state.orderInfo.tableId = payload.tableId;
      state.orderInfo.tableNumber = payload.tableNumber;
    },
    submitDeliveryAddress(state, payload) {
      state.deliveryAddress = payload;
    },
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {},
  getters: {
    getCartList(state) {
      return state.cart;
    },
  },
});
