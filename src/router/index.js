import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/paymentInfo",
    name: "PaymentInfo",
    component: () => import("../views/PaymentInfo.vue"),
  },
  {
    path: "/clearCache",
    name: "clearCache",
    beforeEnter: (to, from, next) => {
      store.commit("resetState");
      return next({ name: "Home" });
    },
  },
  {
    path: "/loyalty",
    name: "Loyalty",
    component: () => import("../views/loyaltyProgram.vue"),
  },
  {
    path: "/requisites",
    name: "Requisites",
    component: () => import("../views/Requisites.vue"),
  },
  {
    path: "/franchise",
    name: "Franchise",
    component: () => import("../views/Franchise.vue"),
  },
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("../views/Privacy.vue"),
  },
  {
    path: "/menu/:groupId",
    name: "Menu",
    component: () => import("../views/Menu.vue"),
  },
  {
    path: "/howto/:groupId",
    name: "howTo",
    component: () => import("../views/HowToCook.vue"),
  },
  {
    path: "/post/:postId",
    name: "PostPage",
    component: () => import("../views/PostPage.vue"),
  },
  { path: "*", redirect: { name: "Home" } },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from) {
    if (from.path !== to.path) {
      return { x: 0, y: 0 };
    }
  },
});

import * as metaData from "./meta.json";
const allMeta = metaData.default;
const defaultMeta = {
  title: "Пельмени доставка-Пельмения",
  description:
    "В нашем ресторане можно заказать пельмени на любой вкус круглосуточно, только у нас пельмени 37 народов мира лепятся вручную, у нас действует доставка по СПБ и имеется самовывоз ,кешбек для постоянных покупателей, заказать по номеру телефона +7 (812) 600-79-29",
};
router.beforeEach((to, from, next) => {
  let metaForPage = allMeta.find((meta) => to.path.includes(meta.route));
  let description = document.querySelector('head meta[name="description"]');
  if (metaForPage) {
    document.title = metaForPage.title;
    description.setAttribute("content", metaForPage.description);
  } else {
    document.title = defaultMeta.title;
    description.setAttribute("content", defaultMeta.description);
  }
  next();
});

export default router;
