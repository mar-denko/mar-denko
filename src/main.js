import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import LazyTube from "vue-lazytube";
import Vue2TouchEvents from "vue2-touch-events";
import VueLazyload from "vue-lazyload";

Vue.use(LazyTube);
Vue.use(Vue2TouchEvents);
Vue.use(VueLazyload);

import "./assets/fonts/font.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
