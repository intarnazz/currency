import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/page/HomePage.vue";
import Converter from "../components/page/ConverterPage.vue"
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/converter",
    name: "Converter",
    component: Converter,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
