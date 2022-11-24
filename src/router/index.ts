import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export type CustomRouteRecordRaw = RouteRecordRaw & {
  meta?: {
    redirectable?: true;
    requiredLogin?: true;
  };
  children?: CustomRouteRecordRaw[];
};

const routes: Array<CustomRouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    name: "home",
    path: "/home",
    component: () => import("@/views/Index.vue"),
  },
  {
    name: "earthMoon",
    path: "/earthMoon",
    component: () => import("@/views/EarthMoon.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
