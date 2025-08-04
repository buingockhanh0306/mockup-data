import App from "./App.vue";
import { createApp } from "vue";
import { createBootstrap } from "bootstrap-vue-next";
import router from "./router";
// main.js hoặc main.ts
import "../assets/css/index.css";

// Add the necessary CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);
app.config.devtools = true;
app.use(router).use(createBootstrap()); // Important
app.mount("#app");
