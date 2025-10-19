// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import GenerateJSON from "@/pages/GenerateJSON.vue";
import GenerateText from "@/pages/GenerateText.vue";
import GenerateVoice from "@/pages/GenerateVoice.vue";
// import GenerateQr from "@/pages/GenerateQr.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: GenerateJSON,
  },
  {
    path: "/generate-text",
    name: "GenerateText",
    component: GenerateText,
  },
  {
    path: "/generate-voice",
    name: "GenerateVoice",
    component: GenerateVoice,
  },
  // {
  //   path: "/generate-qr",
  //   name: "GenerateQr",
  //   component: GenerateQr,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
