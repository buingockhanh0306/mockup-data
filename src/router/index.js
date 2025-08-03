// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import GenerateJSON from "@/pages/GenerateJSON.vue";
import GenerateText from "@/pages/GenerateText.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
