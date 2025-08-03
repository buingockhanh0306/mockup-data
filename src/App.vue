<template>
  <Navbar />
  <body>
    <router-view />
  </body>
</template>
<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
<style scoped>
body {
  font-family: "Poppins", sans-serif;
  margin: 0;
  padding: 2rem;
  background: linear-gradient(to right, #eef2f3, #ffffff);
  color: #333;
  min-height: 100vh;
}
</style>
