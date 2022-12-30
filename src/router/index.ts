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
  //水天一色小岛
  {
    name: "home",
    path: "/home",
    component: () => import("@/views/Index.vue"),
  },
  //地月公转
  {
    name: "earthMoon",
    path: "/earthMoon",
    component: () => import("@/views/EarthMoon.vue"),
  },
  //3D地球
  {
    name: "earth3D",
    path: "/earth3D",
    component: () => import("@/views/earth3D.vue"),
  },
  //金属小球和土地 纹理贴图示例
  {
    name: "newProject",
    path: "/newProject",
    component: () => import("@/views/NewProject.vue"),
  },
  //全景看房
  {
    name: "VR",
    path: "/VR",
    component: () => import("@/views/VR.vue"),
  },
  //obj房子模型
  {
    name: "house",
    path: "/house",
    component: () => import("@/views/house.vue"),
  },
  //glb人物模型
  {
    name: "people",
    path: "/people",
    component: () => import("@/views/people.vue"),
  },
  //告示牌模型
  {
    name: "bill",
    path: "/bill",
    component: () => import("@/views/Billboard.vue"),
  },
  //第一人称自动射击
  {
    name: "shoot",
    path: "/shoot",
    component: () => import("@/views/FirstPersonShooting.vue"),
  },
  //粒子海洋
  {
    name: "particleOcean",
    path: "/particleOcean",
    component: () => import("@/views/ocean/index.vue"),
  },
  //水晶3D展示
  {
    name: "CrystalBear",
    path: "/CrystalBear",
    component: () => import("@/views/CrystalBear.vue"),
  },
  //汽车3D模型
  {
    name: "car",
    path: "/car",
    component: () => import("@/views/car3D.vue"),
  },
  //球形机器人
  {
    name: "robot",
    path: "/robot",
    component: () => import("@/views/Robot.vue"),
  },
  //3D网站
  {
    name: "web3D",
    path: "/web3D",
    component: () => import("@/views/Web3D.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
