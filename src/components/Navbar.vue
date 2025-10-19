<template>
  <b-navbar toggleable="lg" class="custom-navbar">
    <div class="d-flex justify-content-between w-100 align-items-center">
      <b-navbar-brand @click="router.push('/')" class="brand-text"
        >✨ Generate Data ✨</b-navbar-brand
      >
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mx-auto nav-center">
          <router-link
            v-for="route in listRoute"
            :key="route.path"
            :to="route.path"
            class="nav-link-animated"
            :class="{ 'nav-active': $route.path === route.path }"
          >
            {{ route.name }}
          </router-link>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const routes = router.getRoutes().filter((r) => r.name);
const listRoute = [
  {
    name: "Generate JSON",
    path: "/",
  },
  {
    name: "Generate Text",
    path: "/generate-text",
  },
  {
    name: "Generate Voice",
    path: "/generate-voice",
  },
  // {
  //   name: "Generate Qr",
  //   path: "/generate-qr",
  // },
];
</script>

<style scoped>
.custom-navbar {
  position: sticky;
  z-index: 1000;
  top: 0;
  background: linear-gradient(90deg, #6f42c1, #0dcaf0);
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.brand-text {
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
}
.brand-text:hover {
  color: #ffc107;
  cursor: pointer;
}

.nav-center {
  display: flex;
  justify-content: center;
}

.nav-link-animated {
  position: relative;
  font-weight: 500;
  color: white;
  margin: 0 12px;
  transition: color 0.3s ease;
  text-decoration: none;
}

.nav-link-animated::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #ffc107;
  transition: width 0.3s ease;
}

.nav-link-animated:hover {
  color: #ffc107;
}

.nav-link-animated:hover::after {
  width: 100%;
}

.nav-active {
  color: #ffc107 !important;
}
</style>
