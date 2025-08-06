<template>
  <Navbar />
  <body>
    <router-view />
  </body>
  <Footer />
</template>
<script setup>
import { onMounted, ref } from "vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

const showContent = ref(false);

onMounted(() => {
  setTimeout(() => {
    showContent.value = true;
  }, 50); // delay nhỏ để trigger transition
});
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
