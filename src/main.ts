import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import "animate.css";
import router from "./router";

createApp(App).use(router).use(createPinia()).mount("#app");
